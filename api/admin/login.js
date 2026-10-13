import { ADMIN_MAX_AGE, makeToken, safeEqualStr, sessionCookie } from "../_lib/auth.js";
import { readJson, send } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method not allowed" }, { Allow: "POST" });
  const expected = process.env.LOJA_ADMIN_PASSWORD;
  let password = "";
  try {
    password = String((await readJson(req))?.password ?? "");
  } catch {}
  if (!expected || !safeEqualStr(password, expected)) return send(res, 401, { error: "Senha incorreta" });
  return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(makeToken(), ADMIN_MAX_AGE) });
}
