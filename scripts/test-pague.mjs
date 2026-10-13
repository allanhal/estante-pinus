// Live smoke test of pague.dev v2 (needs PAGUEDEV_CLIENT_ID/SECRET in .env).
// Run: pnpm test:pague   -> auth, create a R$1 PIX charge, look it up.
import { randomUUID } from "node:crypto";
import { createPixCharge, getToken, getTransaction, hasPagueDevCreds } from "../api/_lib/paguedev.js";

if (!hasPagueDevCreds()) {
  console.error("PAGUEDEV_CLIENT_ID / PAGUEDEV_CLIENT_SECRET not set in .env (v2 mp_... creds required).");
  process.exit(1);
}
const token = await getToken();
console.log("auth ok, token length", token.length);
const charge = await createPixCharge({
  amount: 1,
  description: "Teste Estante Pinus",
  externalReference: `TEST${Date.now()}`,
  expiresIn: 600,
  idempotencyKey: randomUUID(),
});
console.log("charge:", { id: charge.id, status: charge.status, pixCopyPaste: charge.pixCopyPaste?.slice(0, 30) + "…", expiresAt: charge.expiresAt });
const t = await getTransaction(charge.id);
console.log("transaction:", { id: t.id, status: t.status });
