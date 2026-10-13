import { createHmac, timingSafeEqual } from "node:crypto";
import { parseCookies } from "./http.js";

export const ADMIN_COOKIE = "loja_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 8;

const secret = () => process.env.LOJA_SESSION_SECRET || process.env.LOJA_ADMIN_PASSWORD || "";
const sign = (v) => createHmac("sha256", secret()).update(v).digest("hex");

export function makeToken() {
  const exp = String(Date.now() + ADMIN_MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token) {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(sign(exp), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function safeEqualStr(a, b) {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export const isAdmin = (req) => verifyToken(parseCookies(req)[ADMIN_COOKIE]);

export const sessionCookie = (token, maxAge) =>
  `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` +
  (process.env.VERCEL || process.env.NODE_ENV === "production" ? "; Secure" : "");
