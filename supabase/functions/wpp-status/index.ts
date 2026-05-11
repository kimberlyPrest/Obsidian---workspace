// wpp-status — Edge Function v6
// Responsabilidades:
//   1) POST /  (webhook Evolution: messages.update + connection.update + send.message)
//   2) GET  /?scope=connection                  → estado da instância
//   3) GET  /?scope=delivery&message_id=<uuid>  → status da mensagem
//   4) GET  /?scope=health                      → smoke test
//
// Auth (qualquer um vale):
//   - apikey == WEBHOOK_VERIFY_TOKEN          (Evolution webhook)
//   - apikey == SERVICE_ROLE_KEY              (chave nova)
//   - apikey == LEGACY_SERVICE_ROLE_KEY       (JWT legacy ainda ativo)
//   - apikey == ANON_KEY / LEGACY_ANON_KEY    (frontend)
//   - Authorization: Bearer <qualquer um dos acima>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const LEGACY_SERVICE = Deno.env.get("LEGACY_SERVICE_ROLE_KEY") ?? "";
const LEGACY_ANON = Deno.env.get("LEGACY_ANON_KEY") ?? "";
const WEBHOOK_TOKEN = Deno.env.get("WEBHOOK_VERIFY_TOKEN") ?? "";

const sb = createClient(SUPABASE_URL, SERVICE_ROLE || LEGACY_SERVICE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function authorized(req: Request): boolean {
  const apikey = req.headers.get("apikey") ?? "";
  const authHeader = req.headers.get("authorization") ?? "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "");
  const valid = new Set<string>(
    [WEBHOOK_TOKEN, SERVICE_ROLE, LEGACY_SERVICE, ANON_KEY, LEGACY_ANON].filter(Boolean),
  );
  if (apikey && valid.has(apikey)) return true;
  if (bearer && valid.has(bearer)) return true;
  return false;
}

// ACK mapping (Baileys/Evolution v2)
function ackToStatus(ack: number | string | null | undefined) {
  const n = typeof ack === "string" ? Number(ack) : (ack ?? -1);
  if (n === 0) return { status: "failed", ack_level: 0 };
  if (n === 1) return { status: "pending", ack_level: 1 };
  if (n === 2) return { status: "sent", ack_level: 2 };
  if (n === 3) return { status: "delivered", ack_level: 3 };
  if (n === 4) return { status: "read", ack_level: 4 };
  if (n === 5) return { status: "read", ack_level: 5 };
  return { status: "pending", ack_level: 1 };
}

function statusStringToStatus(s: string | undefined) {
  if (!s) return null;
  const up = String(s).toUpperCase();
  if (up === "PENDING") return { status: "pending", ack_level: 1 };
  if (up === "SERVER_ACK" || up === "SENT") return { status: "sent", ack_level: 2 };
  if (up === "DELIVERY_ACK" || up === "DELIVERED") return { status: "delivered", ack_level: 3 };
  if (up === "READ") return { status: "read", ack_level: 4 };
  if (up === "PLAYED") return { status: "read", ack_level: 5 };
  if (up === "ERROR" || up === "FAILED") return { status: "failed", ack_level: 0 };
  return null;
}

async function handleMessagesUpdate(body: any) {
  const data = body?.data ?? body;
  const keyId = data?.keyId ?? data?.key?.id;
  const newStatus = data?.status;
  const ack = data?.ack;
  const instanceName = body?.instance ?? body?.instanceName;

  if (!keyId) return { updated: 0, error: "missing keyId" };

  const resolved = statusStringToStatus(newStatus) ?? (ack !== undefined ? ackToStatus(ack) : null);
  if (!resolved) return { updated: 0, error: "no status/ack info" };

  let instance_id: string | null = null;
  if (instanceName) {
    const { data: inst } = await sb
      .from("evolution_instances")
      .select("id")
      .eq("instance_name", instanceName)
      .maybeSingle();
    instance_id = inst?.id ?? null;
  }

  const patch: Record<string, unknown> = {
    status: resolved.status,
    ack_level: resolved.ack_level,
  };
  if (resolved.status === "delivered") patch.delivered_at = new Date().toISOString();
  if (resolved.status === "read") patch.read_at = new Date().toISOString();
  if (resolved.status === "failed") patch.error_reason = String(data?.error ?? data?.reason ?? "");

  let q = sb.from("whatsapp_messages").update(patch).eq("evolution_message_id", keyId);
  if (instance_id) q = q.eq("instance_id", instance_id);
  const { data: rows, error } = await q.select("id, status, ack_level");

  if (error) return { updated: 0, error: error.message };
  return { updated: rows?.length ?? 0, keyId, status: resolved.status };
}

async function handleConnectionUpdate(body: any) {
  const data = body?.data ?? body;
  const state = String(data?.state ?? "unknown").toLowerCase();
  const instanceName = body?.instance ?? body?.instanceName;

  if (!instanceName) return { updated: 0, state, error: "missing instance" };

  const patch: Record<string, unknown> = { status: state, updated_at: new Date().toISOString() };
  if (state === "open" || state === "connected") patch.last_connected_at = new Date().toISOString();
  if (state === "close" || state === "disconnected") patch.last_disconnected_at = new Date().toISOString();

  const { error } = await sb
    .from("evolution_instances")
    .update(patch)
    .eq("instance_name", instanceName);
  return { updated: error ? 0 : 1, state, error: error?.message };
}

async function getConnection() {
  const { data, error } = await sb
    .from("evolution_instances")
    .select(
      "id, instance_name, display_label, status, last_connected_at, last_disconnected_at, is_default, owner_phone, updated_at",
    )
    .order("is_default", { ascending: false })
    .limit(10);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, instances: data });
}

async function getDelivery(messageId: string) {
  const { data, error } = await sb
    .from("whatsapp_messages")
    .select(
      "id, evolution_message_id, direction, status, ack_level, sent_at, delivered_at, read_at, error_reason, remote_jid, message_type, created_at",
    )
    .eq("id", messageId)
    .maybeSingle();
  if (error) return json({ ok: false, error: error.message }, 500);
  if (!data) return json({ ok: false, error: "not_found" }, 404);
  return json({ ok: true, message: data });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (!authorized(req)) return json({ ok: false, error: "unauthorized" }, 401);

  const url = new URL(req.url);
  const scope = url.searchParams.get("scope");

  try {
    if (req.method === "GET") {
      if (scope === "connection") return await getConnection();
      if (scope === "delivery") {
        const id = url.searchParams.get("message_id");
        if (!id) return json({ ok: false, error: "message_id required" }, 400);
        return await getDelivery(id);
      }
      if (scope === "health") {
        return json({ ok: true, ts: new Date().toISOString(), version: "6" });
      }
      return json({ ok: false, error: "unknown scope" }, 400);
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const event: string =
        body?.event ?? body?.evolution_event ?? body?.type ?? "unknown";

      await sb.from("evolution_webhook_log").insert({
        evolution_event: event,
        evolution_event_id: body?.id ?? body?.eventId ?? null,
        payload: body,
        processed: true,
        processed_at: new Date().toISOString(),
      });

      let result: any;
      if (event === "messages.update" || event === "send.message") {
        result = await handleMessagesUpdate(body);
      } else if (event === "connection.update") {
        result = await handleConnectionUpdate(body);
      } else {
        result = { skipped: true, reason: `event ${event} not handled by wpp-status` };
      }

      return json({ ok: true, event, ...result });
    }

    return json({ ok: false, error: "method not allowed" }, 405);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
});
