import { randomUUID } from "node:crypto";
import { createPixCharge, getTransaction, hasPagueDevCreds } from "./paguedev.js";

// LOJA_PIX_MOCK=1 gives a fake charge for local testing when pague.dev
// credentials are absent. It is ignored in production.
export const mockEnabled = () =>
  process.env.LOJA_PIX_MOCK === "1" && process.env.NODE_ENV !== "production" && !process.env.VERCEL;

export async function createCharge(input) {
  if (!hasPagueDevCreds()) {
    if (mockEnabled()) {
      return {
        id: `mock-${randomUUID()}`,
        status: "pending",
        amount: input.amount,
        pixCopyPaste: `00020126MOCK${input.externalReference}`,
        expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      };
    }
    throw new Error("PIX provider not configured");
  }
  return createPixCharge(input);
}

export async function chargeStatus(id) {
  if (id.startsWith("mock-") && mockEnabled()) return { status: "pending", paidAt: null };
  const t = await getTransaction(id);
  return { status: t.status, paidAt: t.paidAt ?? null };
}
