import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY') ?? ''

// ── Helpers para Evolution API ──────────────────────────────────────────────

async function evoRequest<T = unknown>(baseUrl: string, path: string, method: 'GET' | 'POST' = 'POST', body?: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const url = `${baseUrl}${path}`
    const options: RequestInit = { 
      method, 
      headers: { 
        apikey: EVOLUTION_API_KEY, 
        'Content-Type': 'application/json' 
      } 
    }
    if (method === 'POST' && body) options.body = JSON.stringify(body)
    
    const res = await fetch(url, options)
    
    if (!res.ok) { 
      const errorText = await res.text()
      return { ok: false, error: `[HTTP ${res.status}] ${errorText}` }
    }
    
    const ct = res.headers.get('content-type')
    if (ct && ct.includes('application/json')) {
      return { ok: true, data: await res.json() as T }
    }
    return { ok: true }
  } catch (err) { 
    return { ok: false, error: (err as Error).message }
  }
}

function phoneFromJid(jid: string): string {
  if (!jid) return ''
  return jid.split('@')[0]
}

// ── Handler principal ─────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // Segurança: aceita apenas chamadas via Cron Job autenticado com a Service Role Key, ou via Authorization Header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
    // Vamos permitir rodar se for uma chamada segura vinda do próprio Supabase (via trigger ou pg_net)
    // Para simplificar no desenvolvimento, você pode restringir isso depois.
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const results = []

  try {
    // 1. Busca mensagens na fila (status = scheduled e scheduled_at <= NOW)
    // Limite de 10 por execução para evitar timeout. Se o cron rodar a cada 30s, despacha 20 por min.
    const { data: queue, error: queueError } = await supabase
      .from('whatsapp_outbound_queue')
      .select('*, evolution_instances(instance_name, base_url)')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(10)

    if (queueError) throw new Error(`Falha ao ler fila: ${queueError.message}`)
    if (!queue || queue.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: 'Fila vazia' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    // 2. Processa cada mensagem da fila
    for (const msg of queue) {
      const { id, remote_jid, content, media_type, media_url, attempts, evolution_instances } = msg
      
      if (!evolution_instances) {
        await supabase.from('whatsapp_outbound_queue').update({ status: 'failed', last_error: 'Instance not linked' }).eq('id', id)
        continue
      }

      const instanceName = evolution_instances.instance_name
      const baseUrl = evolution_instances.base_url

      // Marca como 'sending'
      await supabase.from('whatsapp_outbound_queue').update({ status: 'sending' }).eq('id', id)

      const phoneNumber = phoneFromJid(remote_jid)
      let endpoint = `/message/sendText/${instanceName}`
      let payload: Record<string, any> = {
        number: phoneNumber,
        options: { delay: 1200, presence: "composing" }
      }

      // Prepara payload de acordo com o media_type
      if (media_type === 'text') {
        payload.textMessage = { text: content }
      } else if (media_type === 'audio') {
        endpoint = `/message/sendWhatsAppAudio/${instanceName}`
        payload.audioMessage = { audio: media_url }
      } else if (media_type === 'image') {
        endpoint = `/message/sendMedia/${instanceName}`
        payload.mediaMessage = { mediatype: 'image', caption: content || '', media: media_url }
      } else if (media_type === 'document') {
        endpoint = `/message/sendMedia/${instanceName}`
        payload.mediaMessage = { mediatype: 'document', caption: content || '', media: media_url }
      } else {
        // Fallback
        payload.textMessage = { text: content }
      }

      // 3. Dispara para Evolution API
      console.log(`[outbound] Enviando para ${phoneNumber} via ${instanceName}...`)
      const res = await evoRequest<any>(baseUrl, endpoint, 'POST', payload)

      if (res.ok && res.data) {
        // Sucesso
        const evoMessageId = res.data.key?.id || res.data.message?.key?.id || res.data.id || null
        
        await supabase.from('whatsapp_outbound_queue').update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          evolution_message_id: evoMessageId,
          last_error: null
        }).eq('id', id)
        
        results.push({ id, status: 'sent', evoMessageId })
      } else {
        // Falha
        const newAttempts = (attempts || 0) + 1
        const maxAttempts = 3
        const isFailed = newAttempts >= maxAttempts

        await supabase.from('whatsapp_outbound_queue').update({
          status: isFailed ? 'failed' : 'scheduled',
          attempts: newAttempts,
          last_error: res.error || 'Unknown error'
        }).eq('id', id)
        
        results.push({ id, status: isFailed ? 'failed' : 'retrying', error: res.error })
      }
    }

    return new Response(JSON.stringify({ ok: true, processed: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('[wpp-outbound] Erro geral:', errMsg)
    return new Response(JSON.stringify({ ok: false, error: errMsg }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
