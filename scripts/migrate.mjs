// Applies scripts/schema.sql using NEON_URL. Run: pnpm migrate  (loads .env)
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
const sql = neon(process.env.NEON_URL);
const stmts = readFileSync(new URL("./schema.sql", import.meta.url), "utf8")
  .split(";").map((s) => s.trim()).filter(Boolean);
for (const s of stmts) await sql.query(s);
const rows = await sql.query("select table_name from information_schema.tables where table_schema='public' order by 1");
console.log("tables:", rows.map((r) => r.table_name));
