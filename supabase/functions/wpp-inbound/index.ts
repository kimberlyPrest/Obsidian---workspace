import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const WEBHOOK_TOKEN = Deno.env.get('WPP_WEBHOOK_TOKEN') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// ── Tipos ────────────────────────────────────────────────────────────────────

type MediaType = 'text' | 'audio' | 'image' | 'document' | 'video' | 'sticker' | 'reaction' | 'other'
type MessageStatus = 'received' | 'sent' | 'delivered' | 'read' | 'failed'
type Direction = 'inbound' | 'outbound'
type ConvStatus = 'pendente_resposta_minha' | 'aguardando_resposta_cliente' | 'finalizada'

// ── Helpers ──────────────────────────────────────────────────────────────────

function isLid(jid: string): boolean {
  return typeof jid === 'string' && jid.endsWith('@lid')
}

function isGroup(jid: string): boolean {
  return typeof jid === 'string' && jid.endsWith('@g.us')
}

function phoneFromJid(jid: string): string {
  if (!jid) return ''
  return jid.split('@')[0]
}

function extractContent(data: Record<string, any>): {
  content: string | null
  mediaType: MediaType
  wasAudio: boolean
  mediaUrl: string | null
  mediaMime: string | null
} {
  const msg = data.message ?? {}

  if (msg.conversation) {
    return { content: msg.conversation, mediaType: 'text', wasAudio: false, mediaUrl: null, mediaMime: null }
  }
  if (msg.extendedTextMessage?.text) {
    return { content: msg.extendedTextMessage.text, mediaType: 'text', wasAudio: false, mediaUrl: null, mediaMime: null }
  }
  if (msg.audioMessage) {
    return { content: null, mediaType: 'audio', wasAudio: true, mediaUrl: msg.audioMessage.url ?? null, mediaMime: msg.audioMessage.mimetype ?? 'audio/ogg' }
  }
  if (msg.pttMessage) {
    return { content: null, mediaType: 'audio', wasAudio: true, mediaUrl: msg.pttMessage.url ?? null, mediaMime: msg.pttMessage.mimetype ?? 'audio/ogg' }
  }
  if (msg.imageMessage) {
    return { content: msg.imageMessage.caption ?? null, mediaType: 'image', wasAudio: false, mediaUrl: msg.imageMessage.url ?? null, mediaMime: msg.imageMessage.mimetype ?? 'image/jpeg' }
  }
  if (msg.videoMessage) {
    return { content: msg.videoMessage.caption ?? null, mediaType: 'video', wasAudio: false, mediaUrl: msg.videoMessage.url ?? null, mediaMime: msg.videoMessage.mimetype ?? 'video/mp4' }
  }
  if (msg.documentMessage) {
    return { content: msg.documentMessage.caption ?? null, mediaType: 'document', wasAudio: false, mediaUrl: msg.documentMessage.url ?? null, mediaMime: msg.documentMessage.mimetype ?? 'application/octet-stream' }
  }
  if (msg.stickerMessage) {
    return { content: null, mediaType: 'sticker', wasAudio: false, mediaUrl: msg.stickerMessage.url ?? null, mediaMime: msg.stickerMessage.mimetype ?? 'image/webp' }
  }
  if (msg.reactionMessage) {
    return { content: msg.reactionMessage.text ?? null, mediaType: 'reaction', wasAudio: false, mediaUrl: null, mediaMime: null }
  }

  return { content: null, mediaType: 'other', wasAudio: false, mediaUrl: null, mediaMime: null }
}

function ackToStatus(ack: number | undefined): MessageStatus {
  if (ack === undefined || ack === null) return 'sent'
  if (ack >= 4) return 'read'
  if (ack >= 3) return 'delivered'
  if (ack >= 1) return 'sent'
  return 'sent'
}

// ── Handler principal ─────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')

  if (token !== WEBHOOK_TOKEN) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let payload: Record<string, any>
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), { status: 400 })
  }

  const event: string = payload.event ?? ''
  const instanceName: string = payload.instance ?? ''
  const data: Record<string, any> = payload.data ?? {}
  const key: Record<string, any> = data.key ?? {}
  const evolutionEventId: string | null = key.id ?? null

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Resolve instance
  const { data: instanceRow } = await supabase
    .from('evolution_instances')
    .select('id')
    .eq('instance_name', instanceName)
    .maybeSingle()

  const instanceId: string | null = instanceRow?.id ?? null

  // Log evento (upsert por evolution_event_id para ser idempotente)
  let logId: string | null = null
  if (evolutionEventId) {
    const { data: logRow } = await supabase
      .from('evolution_webhook_log')
      .upsert(
        {
          instance_id: instanceId,
          evolution_event: event,
          evolution_event_id: evolutionEventId,
          payload,
          processed: false,
          received_at: new Date().toISOString(),
        },
        { onConflict: 'evolution_event_id', ignoreDuplicates: true },
      )
      .select('id')
      .maybeSingle()
    logId = logRow?.id ?? null
  }

  const markProcessed = async (error?: string) => {
    if (!logId) return
    await supabase
      .from('evolution_webhook_log')
      .update({ processed: !error, processed_at: new Date().toISOString(), error: error ?? null })
      .eq('id', logId)
  }

  // Ignorar eventos que não sejam mensagens
  if (event !== 'messages.upsert') {
    await markProcessed()
    return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200 })
  }

  if (!instanceId) {
    const err = `Instance not found: ${instanceName}`
    await markProcessed(err)
    return new Response(JSON.stringify({ ok: false, error: err }), { status: 200 })
  }

  try {
    const fromMe: boolean = key.fromMe === true
    const rawRemoteJid: string = key.remoteJid ?? ''
    const previousRemoteJid: string | null = key.previousRemoteJid ?? null
    const senderPn: string | null = key.senderPn ?? null
    const pushName: string | null = data.pushName ?? null
    const msgTimestamp: number | undefined = data.messageTimestamp
    const isGroupChat = isGroup(rawRemoteJid)

    // ── Resolução de LID ──────────────────────────────────────────────────────
    // Para mensagens outbound com @lid, tentamos resolver o phone_number real
    // via a tabela de contatos (que foi populada com o lid de mensagens inbound)
    let resolvedJid = rawRemoteJid
    let resolvedPhone: string | null = null

    if (isLid(rawRemoteJid)) {
      const lid = phoneFromJid(rawRemoteJid)
      const { data: knownContact } = await supabase
        .from('whatsapp_contacts')
        .select('remote_jid, phone_number')
        .eq('instance_id', instanceId)
        .eq('lid', lid)
        .maybeSingle()

      if (knownContact?.phone_number && !isLid(knownContact.remote_jid)) {
        resolvedJid = knownContact.remote_jid
        resolvedPhone = knownContact.phone_number
      }
    }

    const effectiveRemoteJid = resolvedJid
    const effectivePhone = resolvedPhone ?? (isLid(effectiveRemoteJid) ? phoneFromJid(effectiveRemoteJid) : phoneFromJid(effectiveRemoteJid))

    // ── Upsert whatsapp_contacts ──────────────────────────────────────────────
    const msgTs = msgTimestamp ? new Date(msgTimestamp * 1000).toISOString() : new Date().toISOString()

    const contactUpsert: Record<string, any> = {
      instance_id: instanceId,
      remote_jid: effectiveRemoteJid,
      phone_number: effectivePhone,
      is_group: isGroupChat,
      monitored: true,
      last_message_at: msgTs,
      metadata: {},
      first_seen_at: new Date().toISOString(),
    }

    // Armazena push_name somente em mensagens inbound (é o nome do contato)
    if (pushName && !fromMe) contactUpsert.push_name = pushName

    // Armazena o LID do contato vindo do campo previousRemoteJid (mensagens inbound)
    if (!fromMe && previousRemoteJid && isLid(previousRemoteJid)) {
      contactUpsert.lid = phoneFromJid(previousRemoteJid)
    }

    const { data: contact } = await supabase
      .from('whatsapp_contacts')
      .upsert(contactUpsert, {
        onConflict: 'instance_id,remote_jid',
        ignoreDuplicates: false,
      })
      .select('id, client_id, monitored')
      .maybeSingle()

    const contactId: string | null = contact?.id ?? null
    const clientId: string | null = contact?.client_id ?? null
    const monitored: boolean = contact?.monitored ?? true

    // ── Deduplicação ──────────────────────────────────────────────────────────
    if (evolutionEventId) {
      const { data: existing } = await supabase
        .from('whatsapp_messages')
        .select('id, status')
        .eq('evolution_message_id', evolutionEventId)
        .maybeSingle()

      if (existing) {
        // Atualiza ACK se for um evento de atualização de entrega/leitura
        if (data.ack !== undefined && data.ack !== null) {
          const newStatus = ackToStatus(data.ack)
          await supabase
            .from('whatsapp_messages')
            .update({ status: newStatus, ack_level: data.ack, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
        }
        await markProcessed()
        return new Response(JSON.stringify({ ok: true, deduplicated: true }), { status: 200 })
      }
    }

    // ── Extração de conteúdo ──────────────────────────────────────────────────
    const { content, mediaType, wasAudio, mediaUrl, mediaMime } = extractContent(data)

    const direction: Direction = fromMe ? 'outbound' : 'inbound'
    const status: MessageStatus = fromMe ? ackToStatus(data.ack) : 'received'

    // ── Inserção em whatsapp_messages ─────────────────────────────────────────
    const messageRecord: Record<string, any> = {
      instance_id: instanceId,
      evolution_message_id: evolutionEventId,
      evolution_event_id: evolutionEventId,
      remote_jid: effectiveRemoteJid,
      contact_id: contactId,
      client_id: clientId,
      direction,
      from_me: fromMe,
      media_type: mediaType,
      content,
      was_audio: wasAudio,
      media_url: mediaUrl,
      media_mime: mediaMime,
      is_automated: false,
      monitored,
      status,
      ack_level: data.ack ?? null,
      is_forwarded: data.contextInfo?.isForwarded ?? false,
      is_deleted: false,
      raw_payload: data,
      message_timestamp: msgTs,
      received_at: fromMe ? null : new Date().toISOString(),
      sent_at: fromMe ? new Date().toISOString() : null,
    }

    // Para grupos: participant é quem enviou dentro do grupo
    if (isGroupChat && data.participant) {
      messageRecord.participant_jid = data.participant
    }

    // Quoted message
    if (data.contextInfo?.stanzaId) {
      messageRecord.reply_to_evolution_id = data.contextInfo.stanzaId
    }

    const { error: insertError } = await supabase
      .from('whatsapp_messages')
      .insert(messageRecord)

    if (insertError) throw new Error(`insert whatsapp_messages: ${insertError.message}`)

    // ── Upsert whatsapp_conversation_status ───────────────────────────────────
    const convStatus: ConvStatus = fromMe ? 'aguardando_resposta_cliente' : 'pendente_resposta_minha'

    const convPayload: Record<string, any> = {
      instance_id: instanceId,
      contact_id: contactId,
      client_id: clientId,
      remote_jid: effectiveRemoteJid,
      status: convStatus,
      last_status_change_at: new Date().toISOString(),
      metadata: {},
    }

    if (fromMe) {
      convPayload.last_outbound_at = msgTs
    } else {
      convPayload.last_inbound_at = msgTs
    }

    await supabase
      .from('whatsapp_conversation_status')
      .upsert(convPayload, { onConflict: 'instance_id,contact_id' })

    await markProcessed()
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err)
    await markProcessed(errMsg)
    console.error('[wpp-inbound] erro:', errMsg)
    return new Response(JSON.stringify({ ok: false, error: errMsg }), { status: 500 })
  }
})
