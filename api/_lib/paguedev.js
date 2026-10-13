import { createHmac, timingSafeEqual } from "node:crypto";

// Server-only. pague.dev v2 API (api-gateway.pague.dev). The v1 host api.pague.dev is dead.
const BASE = () => process.env.PAGUEDEV_API_URL || "https://api-gateway.pague.dev/v2";

let cached = null;

export const hasPagueDevCreds = () =>
  Boolean(process.env.PAGUEDEV_CLIENT_ID && process.env.PAGUEDEV_CLIENT_SECRET);

export async function getToken() {
  if (cached && cached.expiresAt - Date.now() > 30_000) return cached.token;
  const client_id = process.env.PAGUEDEV_CLIENT_ID;
  const client_secret = process.env.PAGUEDEV_CLIENT_SECRET;
  if (!client_id || !client_secret) throw new Error("PAGUEDEV_CLIENT_ID/SECRET not set");
  const res = await fetch(`${BASE()}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id, client_secret }),
  });
  if (!res.ok) throw new Error(`pague.dev auth failed: ${res.status}`);
  const data = await res.json();
  cached = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

/** amount in BRL (min 1). Returns { id, status, pixCopyPaste, qrCodeBase64?, expiresAt }. */
export async function createPixCharge({ idempotencyKey, ...input }) {
  const token = await getToken();
  const res = await fetch(`${BASE()}/pix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      ...input,
      description: input.description.slice(0, 255),
      metadata: { orderId: input.externalReference },
    }),
  });
  if (!res.ok) throw new Error(`pague.dev create PIX failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

// id may be the charge id, our externalReference, or the Idempotency-Key.
// Returns { id, status: pending|completed|failed|cancelled, paidAt? }.
export async function getTransaction(id) {
  const token = await getToken();
  const res = await fetch(`${BASE()}/transactions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`pague.dev get transaction failed: ${res.status}`);
  return await res.json();
}

/** X-Pague-Signature: sha256=<hex HMAC-SHA256 of raw body>, key = webhook secret (used directly). */
export function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(String(signatureHeader).replace(/^sha256=/, ""), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
