import { randomInt } from "node:crypto";
import { query } from "./db.js";

// Short, user-facing order reference: 8 chars, no 0/O/1/I/L.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CODE_RE = /^[A-Z2-9]{8}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isOrderRef = (ref) => CODE_RE.test(ref.toUpperCase()) || UUID_RE.test(ref);
const makeCode = () => Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");

export async function insertOrder(o) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const rows = await query(
      `insert into orders (code, items, subtotal, shipping, total, customer, address)
       values ($1, $2::jsonb, $3, $4, $5, $6::jsonb, $7::jsonb)
       on conflict (code) do nothing returning *`,
      [makeCode(), JSON.stringify(o.items), o.subtotal, o.shipping, o.total, JSON.stringify(o.customer), JSON.stringify(o.address)]
    );
    if (rows[0]) return rows[0];
  }
  throw new Error("could not allocate order code");
}

export async function setPix(id, p) {
  await query(
    `update orders set pix_charge_id=$2, pix_copy_paste=$3, pix_qr_base64=$4, external_reference=(select code from orders where id=$1), updated_at=now() where id=$1`,
    [id, p.chargeId, p.copyPaste, p.qr ?? null]
  );
}

// Accepts the short code (case-insensitive) or, for internal use, the uuid.
export async function getOrder(ref) {
  const rows = UUID_RE.test(ref)
    ? await query("select * from orders where id=$1", [ref])
    : await query("select * from orders where code=$1", [ref.toUpperCase()]);
  return rows[0] ?? null;
}

export const listOrders = () => query("select * from orders order by created_at desc limit 200");

export async function markPaid(where, paidAt) {
  const rows = await query(
    `update orders set status='paid', paid_at=coalesce($3::timestamptz, now()), updated_at=now()
     where (id::text=$1 or code=$1 or pix_charge_id=$2) and status <> 'paid' returning *`,
    [where.id ?? "", where.chargeId ?? "", paidAt ?? null]
  );
  return rows[0] ?? null;
}

export async function setStatus(id, status) {
  await query("update orders set status=$2, updated_at=now() where id=$1 and status='pending'", [id, status]);
}

export async function claimWebhookEvent(eventId) {
  const rows = await query(
    "insert into webhook_events (event_id) values ($1) on conflict do nothing returning event_id",
    [eventId]
  );
  return rows.length > 0;
}
