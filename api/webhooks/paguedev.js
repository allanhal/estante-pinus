import { verifyWebhookSignature } from "../_lib/paguedev.js";
import { claimWebhookEvent, markPaid } from "../_lib/orders.js";
import { readRaw, send } from "../_lib/http.js";

// The HMAC is over the RAW body: never touch req.body, read the stream.
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method not allowed" }, { Allow: "POST" });
  const raw = await readRaw(req);
  const secret = process.env.PAGUEDEV_WEBHOOK_SECRET ?? "";
  if (!verifyWebhookSignature(raw, req.headers["x-pague-signature"] ?? null, secret)) {
    return send(res, 401, { error: "invalid signature" });
  }
  let evt;
  try {
    evt = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: "bad json" });
  }
  if (evt?.eventId && !(await claimWebhookEvent(String(evt.eventId)))) {
    return send(res, 200, { ok: true, duplicate: true });
  }
  if (evt?.event === "payment_completed") {
    const d = evt.data ?? {};
    await markPaid({ id: d.externalReference, chargeId: d.transactionId || d.id }, d.paidAt ?? null);
  }
  return send(res, 200, { ok: true });
}
