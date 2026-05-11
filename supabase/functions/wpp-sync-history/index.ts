import 'https://deno.land/x/supabase@1.1.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY') ?? ''

type MediaType =
  | 'text'
  | 'audio'
  | 'image'
  | 'document'
  | 'video'
  | 'sticker'
  | 'reaction'
  | 'other'
type MessageStatus = 'received' | 'sent' | 'delivered' | 'read' | 'failed'

function isLid(jid: string) {
  return typeof jid === 'string' && jid.endsWith('@lid')
}
function isGroup(jid: string) {
  return typeof jid === 'string' && jid.endsWith('@g.us')
}
function phoneFromJid(jid: string) {
  return (jid ?? '').split('@')[0]
}

function extractContent(msg: Record<string, any> | null) {
  if (!msg)
    return {
      content: null as string | null,
      mediaType: 'other' as MediaType,
      wasAudio: false,
      mediaUrl: null as string | null,
      mediaMime: null as string | null,
    }
  if (msg.conversation)
    return {
      content: msg.conversation,
      mediaType: 'text' as MediaType,
      wasAudio: false,
      mediaUrl: null,
      mediaMime: null,
    }
  if (msg.extendedTextMessage?.text)
    return {
      content: msg.extendedTextMessage.text,
      mediaType: 'text' as MediaType,
      wasAudio: false,
      mediaUrl: null,
      mediaMime: null,
    }
  if (msg.audioMessage || msg.pttMessage) {
    const a = msg.audioMessage ?? msg.pttMessage
    return {
      content: null,
      mediaType: 'audio' as MediaType,
      wasAudio: true,
      mediaUrl: a?.url ?? null,
      mediaMime: a?.mimetype ?? 'audio/ogg',
    }
  }
  if (msg.imageMessage)
    return {
      content: msg.imageMessage.caption ?? null,
      mediaType: 'image' as MediaType,
      wasAudio: false,
      mediaUrl: msg.imageMessage.url ?? null,
      mediaMime: msg.imageMessage.mimetype ?? 'image/jpeg',
    }
  if (msg.videoMessage)
    return {
      content: msg.videoMessage.caption ?? null,
      mediaType: 'video' as MediaType,
      wasAudio: false,
      mediaUrl: msg.videoMessage.url ?? null,
      mediaMime: msg.videoMessage.mimetype ?? 'video/mp4',
    }
  if (msg.documentMessage)
    return {
      content: msg.documentMessage.caption ?? null,
      mediaType: 'document' as MediaType,
      wasAudio: false,
      mediaUrl: msg.documentMessage.url ?? null,
      mediaMime: msg.documentMessage.mimetype ?? 'application/octet-stream',
    }
  if (msg.stickerMessage)
    return {
      content: null,
      mediaType: 'sticker' as MediaType,
      wasAudio: false,
      mediaUrl: msg.stickerMessage.url ?? null,
      mediaMime: msg.stickerMessage.mimetype ?? 'image/webp',
    }
  if (msg.reactionMessage)
    return {
      content: msg.reactionMessage.text ?? null,
      mediaType: 'reaction' as MediaType,
      wasAudio: false,
      mediaUrl: null,
      mediaMime: null,
    }
  return {
    content: null,
    mediaType: 'other' as MediaType,
    wasAudio: false,
    mediaUrl: null,
    mediaMime: null,
  }
}

function ackToStatus(ack?: number): MessageStatus {
  if (ack === undefined || ack === null) return 'sent'
  if (ack >= 4) return 'read'
  if (ack >= 3) return 'delivered'
  return 'sent'
}

// ── Evolution API Request ─────────────────────────────────────────────────
async function evoRequest<T = unknown>(
  baseUrl: string,
  path: string,
  method: 'GET' | 'POST' = 'POST',
  body?: unknown,
): Promise<T | null> {
  try {
    const url = `${baseUrl}${path}`
    const options: RequestInit = {
      method,
      headers: { apikey: EVOLUTION_API_KEY, 'Content-Type': 'application/json' },
    }
    if (method === 'POST' && body) options.body = JSON.stringify(body)
    const res = await fetch(url, options)
    if (!res.ok) {
      console.warn(`[evo] ${method} ${path} → ${res.status}`)
      return null
    }
    const ct = res.headers.get('content-type')
    if (ct && ct.includes('application/json')) return res.json() as Promise<T>
    return null
  } catch (err) {
    console.error(`[evo] error:`, (err as Error).message)
    return null
  }
}

// ── Busca GLOBAL de mensagens via POST /chat/findMessages ─────────────────
async function fetchAllMessages(
  baseUrl: string,
  instanceName: string,
  page: number,
  limit: number,
): Promise<{ records: any[]; total: number; pages: number }> {
  const res = await evoRequest<any>(baseUrl, `/chat/findMessages/${instanceName}`, 'POST', {
    where: {},
    limit,
    page,
  })
  if (res?.messages?.records)
    return {
      records: res.messages.records,
      total: res.messages.total ?? 0,
      pages: res.messages.pages ?? 0,
    }
  if (Array.isArray(res)) return { records: res, total: res.length, pages: 1 }
  return { records: [], total: 0, pages: 0 }
}

// ── Processa uma mensagem e cria contato automaticamente ──────────────────
async function processMessage(
  supabase: ReturnType<typeof createClient>,
  instanceId: string,
  msg: Record<string, any>,
  lidCache: Map<string, string>,
  dryRun: boolean,
): Promise<'inserted' | 'skipped' | 'error'> {
  try {
    const key = msg.key ?? {}
    const fromMe = key.fromMe === true
    const rawJid: string = key.remoteJid ?? ''
    const evolutionMsgId: string | null = key.id ?? msg.id ?? null
    if (!rawJid || !evolutionMsgId) return 'skipped'
    if (dryRun) return 'inserted'

    // Resolução de LID
    let effectiveJid = rawJid
    if (isLid(rawJid)) {
      const lid = phoneFromJid(rawJid)
      const cached = lidCache.get(lid)
      if (cached) {
        effectiveJid = cached
      } else {
        const { data: known } = await supabase
          .from('whatsapp_contacts')
          .select('remote_jid')
          .eq('instance_id', instanceId)
          .eq('lid', lid)
          .not('remote_jid', 'like', '%@lid')
          .maybeSingle()
        if (known?.remote_jid) {
          effectiveJid = known.remote_jid
          lidCache.set(lid, known.remote_jid)
        }
      }
    }

    if (!fromMe && key.previousRemoteJid && isLid(key.previousRemoteJid)) {
      const lid = phoneFromJid(key.previousRemoteJid)
      if (!lidCache.has(lid)) lidCache.set(lid, effectiveJid)
      await supabase
        .from('whatsapp_contacts')
        .update({ lid })
        .eq('instance_id', instanceId)
        .eq('remote_jid', effectiveJid)
        .is('lid', null)
    }

    // Upsert contato (cria automaticamente conforme processa mensagens)
    const phone = phoneFromJid(effectiveJid)
    const { data: contact } = await supabase
      .from('whatsapp_contacts')
      .upsert(
        {
          instance_id: instanceId,
          remote_jid: effectiveJid,
          phone_number: phone,
          is_group: isGroup(effectiveJid),
          monitored: true,
          metadata: {},
          first_seen_at: new Date().toISOString(),
          ...(!fromMe && msg.pushName ? { push_name: msg.pushName } : {}),
        },
        { onConflict: 'instance_id,remote_jid', ignoreDuplicates: false },
      )
      .select('id, client_id, monitored')
      .maybeSingle()

    const msgTs = msg.messageTimestamp
      ? new Date(Number(msg.messageTimestamp) * 1000).toISOString()
      : null
    if (!msgTs) return 'skipped'

    const { content, mediaType, wasAudio, mediaUrl, mediaMime } = extractContent(
      msg.message ?? null,
    )
    const direction = fromMe ? 'outbound' : 'inbound'
    const status: MessageStatus = fromMe ? ackToStatus(msg.ack) : 'received'

    const record: Record<string, any> = {
      instance_id: instanceId,
      evolution_message_id: evolutionMsgId,
      evolution_event_id: evolutionMsgId,
      remote_jid: effectiveJid,
      contact_id: contact?.id ?? null,
      client_id: contact?.client_id ?? null,
      direction,
      from_me: fromMe,
      media_type: mediaType,
      content,
      was_audio: wasAudio,
      media_url: mediaUrl,
      media_mime: mediaMime,
      is_automated: false,
      monitored: contact?.monitored ?? true,
      status,
      ack_level: msg.ack ?? null,
      is_forwarded: msg.contextInfo?.isForwarded ?? false,
      is_deleted: false,
      raw_payload: msg,
      message_timestamp: msgTs,
      received_at: fromMe ? null : msgTs,
      sent_at: fromMe ? msgTs : null,
    }
    if (isGroup(effectiveJid) && msg.participant) record.participant_jid = msg.participant
    if (msg.contextInfo?.stanzaId) record.reply_to_evolution_id = msg.contextInfo.stanzaId

    // Deduplicação
    const { data: existing } = await supabase
      .from('whatsapp_messages')
      .select('id, status')
      .eq('evolution_message_id', evolutionMsgId)
      .maybeSingle()
    if (existing) {
      if (status !== existing.status)
        await supabase
          .from('whatsapp_messages')
          .update({ status, ack_level: msg.ack, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      return 'skipped'
    }

    const { error } = await supabase.from('whatsapp_messages').insert(record)
    if (error) {
      console.error('[sync] insert error:', error.message)
      return 'error'
    }
    return 'inserted'
  } catch (err) {
    console.error('[sync] processMessage error:', (err as Error).message)
    return 'error'
  }
}

// ── Handler Principal ─────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  let body: Record<string, any> = {}
  if (req.method === 'POST') {
    try {
      body = await req.json()
    } catch {
      /* ignora */
    }
  }

  const { data: instances } = await supabase
    .from('evolution_instances')
    .select('id, instance_name, base_url, status')
    .eq('status', 'connected')

  const targetInstances = body.instance_id
    ? (instances ?? []).filter((i: any) => i.id === body.instance_id)
    : (instances ?? [])

  if (!targetInstances.length) {
    return new Response(JSON.stringify({ ok: false, error: 'Nenhuma instância conectada' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const rangeStart = new Date(body.range_start ?? '2026-01-01T00:00:00Z')
  const rangeEnd = new Date(body.range_end ?? new Date().toISOString())
  const tsMin = Math.floor(rangeStart.getTime() / 1000)
  const tsMax = Math.floor(rangeEnd.getTime() / 1000)
  const dryRun: boolean = body.dry_run === true
  const pageStart: number = body.page_start ?? 1
  const pagesPerRun: number = body.pages_per_run ?? 20 // ~2000 msgs por execução
  const limitPerPage: number = body.limit ?? 100
  const results: Record<string, any>[] = []

  for (const instance of targetInstances as any[]) {
    const { data: syncState } = await supabase
      .from('whatsapp_sync_state')
      .insert({
        instance_id: instance.id,
        scope: 'history_full',
        status: 'running',
        range_start: rangeStart.toISOString(),
        range_end: rangeEnd.toISOString(),
        total_imported: 0,
        total_failed: 0,
        metadata: { dry_run: dryRun, page_start: pageStart, pages_per_run: pagesPerRun },
        last_run_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    const syncId = syncState?.id ?? null
    const updateSync = async (patch: Record<string, any>) => {
      if (!syncId) return
      await supabase
        .from('whatsapp_sync_state')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', syncId)
    }

    try {
      const lidCache = new Map<string, string>()
      let totalInserted = 0,
        totalSkipped = 0,
        totalFailed = 0
      let totalApiMessages = 0,
        totalPages = 0
      const contactsSeen = new Set<string>()

      // Primeira chamada para saber o total
      const first = await fetchAllMessages(
        instance.base_url,
        instance.instance_name,
        pageStart,
        limitPerPage,
      )
      totalApiMessages = first.total
      totalPages = first.pages
      console.log(
        `[sync] Total na API: ${totalApiMessages} msgs em ${totalPages} páginas. Processando páginas ${pageStart} a ${Math.min(pageStart + pagesPerRun - 1, totalPages)}...`,
      )

      const pageEnd = Math.min(pageStart + pagesPerRun - 1, totalPages)

      for (let page = pageStart; page <= pageEnd; page++) {
        const { records } =
          page === pageStart
            ? first
            : await fetchAllMessages(instance.base_url, instance.instance_name, page, limitPerPage)

        for (const msg of records) {
          const ts = msg.messageTimestamp ?? 0
          if (ts < tsMin || ts > tsMax) {
            totalSkipped++
            continue
          } // Fora do range

          const jid = msg.key?.remoteJid ?? ''
          if (jid) contactsSeen.add(jid)

          const r = await processMessage(supabase, instance.id, msg, lidCache, dryRun)
          if (r === 'inserted') totalInserted++
          else if (r === 'skipped') totalSkipped++
          else totalFailed++
        }

        // Atualiza progresso a cada página
        await updateSync({
          total_imported: totalInserted,
          total_failed: totalFailed,
          last_run_at: new Date().toISOString(),
          metadata: {
            page_current: page,
            page_end: pageEnd,
            total_pages: totalPages,
            total_api: totalApiMessages,
          },
        })
        console.log(
          `[sync] Página ${page}/${totalPages}: +${totalInserted} inseridas, ${totalSkipped} skip, ${totalFailed} erros`,
        )
      }

      const hasMore = pageEnd < totalPages
      const finalStatus =
        totalFailed > 0 && totalInserted === 0 ? 'failed' : hasMore ? 'partial' : 'completed'
      await updateSync({
        status: finalStatus,
        total_imported: totalInserted,
        total_failed: totalFailed,
      })

      await supabase.from('automation_log').insert({
        play_name: 'wpp-sync-history',
        ran_at: new Date().toISOString(),
        status: finalStatus,
        output: JSON.stringify({
          totalInserted,
          totalSkipped,
          totalFailed,
          contactsSeen: contactsSeen.size,
          pagesProcessed: pageEnd - pageStart + 1,
          totalPages,
          dryRun,
        }),
        related_id: syncId,
        related_type: 'sync_state',
      })

      results.push({
        instance: instance.instance_name,
        totalInserted,
        totalSkipped,
        totalFailed,
        contactsDiscovered: contactsSeen.size,
        totalApiMessages,
        pagesProcessed: `${pageStart}-${pageEnd} de ${totalPages}`,
        hasMore,
        nextPage: hasMore ? pageEnd + 1 : null,
        dryRun,
      })
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      await updateSync({ status: 'failed', last_error: errMsg })
      results.push({ instance: instance.instance_name, error: errMsg })
    }
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
