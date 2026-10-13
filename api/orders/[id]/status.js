import { getOrder, isOrderRef, markPaid, setStatus } from "../../_lib/orders.js";
import { chargeStatus } from "../../_lib/pix.js";
import { send } from "../../_lib/http.js";

// Public lookup by short order code. Returns no personal data.
export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "method not allowed" }, { Allow: "GET" });
  const ref = String(req.query?.id ?? new URL(req.url, "http://x").pathname.split("/").at(-2) ?? "");
  if (!isOrderRef(ref)) return send(res, 404, { error: "not found" });
  const order = await getOrder(ref);
  if (!order) return send(res, 404, { error: "not found" });

  let status = order.status;
  if (status === "pending" && order.pix_charge_id) {
    try {
      const t = await chargeStatus(order.pix_charge_id);
      if (["completed", "paid"].includes(t.status)) {
        await markPaid({ id: order.id }, t.paidAt);
        status = "paid";
      } else if (t.status === "failed" || t.status === "cancelled") {
        status = t.status === "failed" ? "failed" : "cancelled";
        await setStatus(order.id, status);
      }
    } catch (e) {
      console.error("status poll failed", e); // keep last known status
    }
  }
  return send(res, 200, {
    code: order.code,
    status,
    total: Number(order.total),
    items: order.items,
    pixCopyPaste: status === "pending" ? order.pix_copy_paste : null,
    qrCodeBase64: status === "pending" ? order.pix_qr_base64 : null,
  });
}
