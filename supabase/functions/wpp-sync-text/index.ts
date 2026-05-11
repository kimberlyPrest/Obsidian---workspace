// wpp-sync-text — Edge Function (Deno)
// Sincroniza APENAS mensagens de TEXTO da Evolution API → whatsapp_messages
// Sem áudio, sem imagem, sem documento. Foco: idempotência + baixo timeout.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

type Json = Record<string, unknown>;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EVOLUTION_BASE_URL = Deno.env.get("EVOLUTION_BASE_URL")!;
const EVOLUTION_API_KEY = Deno.env.get("EVOLUTION_API_KEY")!;
const EVOLUTION_INSTANCIA = Deno.env.get("EVOLUTION_INSTANCIA")!;

// Tipos Evolution que consideramos "texto"
const TEXT_MSG_TYPES = new Set([
  "conversation",
  "extendedTextMessage",
]);

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function jsonResponse(body: Json, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getDefaultInstance() {
  const { data, error } = await sb
    .from("evolution_instances")
    .select("id, instance_name, base_url")
    .eq("is_default", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Nenhuma instance default cadastrada");
  return data as { id: string; instance_name: string; base_url: string | null };
}

function pickContent(m: Json): { content: string | null; mediaType: string } {
  const message = (m["message"] ?? {}) as Json;
  if (typeof message["conversation"] === "string") {
    return { content: message["conversation"] as string, mediaType: "text" };
  }
  const ext = message["extendedTextMessage"] as Json | undefined;
  if (ext && typeof ext["text"] === "string") {
    return { content: ext["text"] as string, mediaType: "text" };
  }
  return { content: null, mediaType: "other" };
}

function pickMessageType(m: Json): string {
  // Evolution às vezes manda messageType direto
  const mt = m["messageType"];
  if (typeof mt === "string") return mt;
  const message = (m["message"] ?? {}) as Json;
  // Inferir pela primeira chave conhecida
  for (const k of Object.keys(message)) return k;
  return "unknown";
}

async function fetchEvolutionMessages(opts: {
  baseUrl: string;
  instance: string;
  remoteJid?: string;
  limit: number;
  offset: number;
}) {
  const url = `${opts.baseUrl.replace(/\/$/, "")}/chat/findMessages/${opts.instance}`;
  const body: Json = {
    where: opts.remoteJid
      ? { key: { remoteJid: opts.remoteJid } }
      : {},
    limit: opts.limit,
    offset: opts.offset,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: EVOLUTION_API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Evolution ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  // Evolution v2 retorna {messages: {records: [...]}} ou diretamente um array
  if (Array.isArray(data)) return data as Json[];
  const records = (data?.messages?.records ?? data?.records ?? data?.data) as
    | Json[]
    | undefined;
  return records ?? [];
}

async function upsertContact(opts: {
  instanceId: string;
  remoteJid: string;
  pushName?: string;
}) {
  const { data, error } = await sb
    .from("whatsapp_contacts")
    .upsert(
      {
        instance_id: opts.instanceId,
        remote_jid: opts.remoteJid,
        push_name: opts.pushName ?? null,
        is_group: opts.remoteJid.endsWith("@g.us"),
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "instance_id,remote_jid" }
    )
    .select("id")
    .maybeSingle();
  if (error) throw error;
  return data?.id as string | undefined;
}

async function upsertSyncState(opts: {
  instanceId: string;
  scope: string;
  remoteJid?: string;
  status: string;
  imported: number;
  failed: number;
  cursor?: string;
  error?: string;
}) {
  const payload = {
    instance_id: opts.instanceId,
    scope: opts.scope,
    remote_jid: opts.remoteJid ?? null,
    status: opts.status,
    total_imported: opts.imported,
    total_failed: opts.failed,
    last_cursor: opts.cursor ?? null,
    last_run_at: new Date().toISOString(),
    last_error: opts.error ?? null,
  };
  // Tenta upsert por (instance_id, scope, remote_jid)
  await sb.from("whatsapp_sync_state").upsert(payload).select();
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Use POST" }, 405);
    }

    let params: {
      mode?: "dry_run" | "run";
      limit?: number;
      offset?: number;
      remote_jid?: string;
    } = {};
    try {
      params = await req.json();
    } catch {
      params = {};
    }
    const mode = params.mode ?? "run";
    const limit = Math.min(Math.max(params.limit ?? 100, 1), 500);
    const offset = Math.max(params.offset ?? 0, 0);
    const remoteJid = params.remote_jid;

    const instance = await getDefaultInstance();
    const baseUrl = instance.base_url ?? EVOLUTION_BASE_URL;
    const instanceName = instance.instance_name ?? EVOLUTION_INSTANCIA;

    const t0 = Date.now();
    const fetched = await fetchEvolutionMessages({
      baseUrl,
      instance: instanceName,
      remoteJid,
      limit,
      offset,
    });

    // Filtrar somente texto
    const textMessages = fetched.filter((m) => {
      const mt = pickMessageType(m);
      return TEXT_MSG_TYPES.has(mt);
    });

    const result = {
      mode,
      instance_id: instance.id,
      instance_name: instanceName,
      total_fetched: fetched.length,
      text_filtered: textMessages.length,
      non_text_skipped: fetched.length - textMessages.length,
      imported: 0,
      failed: 0,
      next_offset: offset + fetched.length,
      duration_ms: 0,
      sample: textMessages.slice(0, 2).map((m) => ({
        id: m["key"] && (m["key"] as Json)["id"],
        type: pickMessageType(m),
        preview: pickContent(m).content?.slice(0, 80) ?? null,
      })),
    };

    if (mode === "dry_run") {
      result.duration_ms = Date.now() - t0;
      return jsonResponse(result);
    }

    // Persistir
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const m of textMessages) {
      try {
        const key = (m["key"] ?? {}) as Json;
        const evoId = key["id"] as string | undefined;
        const remoteJidMsg = key["remoteJid"] as string | undefined;
        const fromMe = Boolean(key["fromMe"]);
        const participant = key["participant"] as string | undefined;
        if (!evoId || !remoteJidMsg) {
          failed++;
          continue;
        }
        const { content } = pickContent(m);
        const messageTimestamp = m["messageTimestamp"] as number | undefined;
        const pushName = (m["pushName"] as string | undefined) ?? undefined;

        // Garante contato
        const contactId = await upsertContact({
          instanceId: instance.id,
          remoteJid: remoteJidMsg,
          pushName,
        });

        const ts =
          typeof messageTimestamp === "number"
            ? new Date(messageTimestamp * 1000).toISOString()
            : new Date().toISOString();

        const { error: upErr } = await sb
          .from("whatsapp_messages")
          .upsert(
            {
              instance_id: instance.id,
              evolution_message_id: evoId,
              remote_jid: remoteJidMsg,
              participant_jid: participant ?? null,
              contact_id: contactId ?? null,
              direction: fromMe ? "outbound" : "inbound",
              from_me: fromMe,
              media_type: "text",
              content: content,
              was_audio: false,
              monitored: true,
              status: fromMe ? "sent" : "received",
              raw_payload: m,
              message_timestamp: ts,
              received_at: fromMe ? null : ts,
              sent_at: fromMe ? ts : null,
            },
            { onConflict: "instance_id,evolution_message_id", ignoreDuplicates: false }
          );

        if (upErr) {
          failed++;
          errors.push(upErr.message);
        } else {
          imported++;
        }
      } catch (e) {
        failed++;
        errors.push((e as Error).message);
      }
    }

    await upsertSyncState({
      instanceId: instance.id,
      scope: remoteJid ? `text:${remoteJid}` : "text:global",
      remoteJid,
      status: failed > 0 ? "partial" : "completed",
      imported,
      failed,
      cursor: String(offset + fetched.length),
      error: errors[0],
    });

    result.imported = imported;
    result.failed = failed;
    result.duration_ms = Date.now() - t0;
    return jsonResponse({ ...result, sample_errors: errors.slice(0, 3) });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
