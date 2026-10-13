import { neon } from "@neondatabase/serverless";

// Server-only. NEON_URL is never exposed to the client (no VITE_ prefix).
let client = null;

export function sql() {
  if (!client) {
    const url = process.env.NEON_URL || process.env.DATABASE_URL;
    if (!url) throw new Error("NEON_URL is not set");
    client = neon(url);
  }
  return client;
}

export async function query(text, params = []) {
  return await sql().query(text, params);
}
