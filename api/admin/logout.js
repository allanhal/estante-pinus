import { sessionCookie } from "../_lib/auth.js";
import { send } from "../_lib/http.js";

export default function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method not allowed" }, { Allow: "POST" });
  return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie("", 0) });
}
