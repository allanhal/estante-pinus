import { randomUUID } from "node:crypto";
import { getProduct, SHIPPING_FLAT } from "../../src/loja/catalog.js";
import { insertOrder, listOrders, setPix, setStatus } from "../_lib/orders.js";
import { createCharge } from "../_lib/pix.js";
import { isAdmin } from "../_lib/auth.js";
import { readJson, send } from "../_lib/http.js";

const digits = (s) => String(s ?? "").replace(/\D/g, "");
const str = (s, max = 200) => String(s ?? "").trim().slice(0, max);
const round2 = (v) => Math.round(v * 100) / 100;

function validCpf(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const n of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += Number(cpf[i]) * (n + 1 - i);
    const d = ((sum * 10) % 11) % 10;
    if (d !== Number(cpf[n])) return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    if (!isAdmin(req)) return send(res, 401, { error: "unauthorized" });
    return send(res, 200, { orders: await listOrders() });
  }
  if (req.method !== "POST") return send(res, 405, { error: "method not allowed" }, { Allow: "GET, POST" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "JSON inválido" });
  }

  // Prices come ONLY from src/loja/catalog.js; the client sends just sku + qty.
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  const items = [];
  for (const it of rawItems) {
    const p = getProduct(String(it?.sku));
    const qty = Number(it?.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return send(res, 400, { error: "Item inválido no carrinho" });
    }
    const existing = items.find((i) => i.sku === p.slug);
    if (existing) existing.qty += qty;
    else items.push({ sku: p.slug, name: p.name, qty, unitPrice: p.price });
  }
  if (!items.length) return send(res, 400, { error: "Carrinho vazio" });

  const c = body?.customer ?? {};
  const customer = {
    name: str(c.name, 120),
    email: str(c.email, 120),
    phone: digits(c.phone),
    cpf: digits(c.cpf),
  };
  const a = body?.address ?? {};
  const address = {
    cep: digits(a.cep),
    street: str(a.street),
    number: str(a.number, 20),
    complement: str(a.complement),
    city: str(a.city, 100),
    state: str(a.state, 2).toUpperCase(),
  };
  const errors = [];
  if (customer.name.length < 3) errors.push("Nome");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email)) errors.push("E-mail");
  if (customer.phone.length < 10 || customer.phone.length > 11) errors.push("Telefone");
  if (!validCpf(customer.cpf)) errors.push("CPF");
  if (address.cep.length !== 8) errors.push("CEP");
  if (!address.street) errors.push("Rua");
  if (!address.number) errors.push("Número");
  if (!address.city) errors.push("Cidade");
  if (address.state.length !== 2) errors.push("UF");
  if (errors.length) return send(res, 400, { error: `Campos inválidos: ${errors.join(", ")}` });

  const subtotal = round2(items.reduce((s, i) => s + i.unitPrice * i.qty, 0));
  const shipping = SHIPPING_FLAT;
  const total = round2(subtotal + shipping);

  const order = await insertOrder({ items, subtotal, shipping, total, customer, address });
  try {
    const charge = await createCharge({
      amount: total,
      description: `Pedido #${order.code} — Estante Pinus`,
      customer: { name: customer.name, document: customer.cpf, email: customer.email, phone: customer.phone },
      externalReference: order.code,
      expiresIn: 3600,
      idempotencyKey: `order-${order.id}-${randomUUID().slice(0, 8)}`,
    });
    await setPix(order.id, { chargeId: charge.id, copyPaste: charge.pixCopyPaste, qr: charge.qrCodeBase64 });
    return send(res, 201, {
      code: order.code,
      total,
      pixCopyPaste: charge.pixCopyPaste,
      qrCodeBase64: charge.qrCodeBase64 ?? null,
      expiresAt: charge.expiresAt ?? null,
    });
  } catch (e) {
    console.error("PIX charge failed", e);
    await setStatus(order.id, "failed");
    return send(res, 502, { error: "Não foi possível gerar o PIX. Tente novamente." });
  }
}
