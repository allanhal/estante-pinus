// Gera as imagens 3D dos produtos da loja a partir dos configuradores.
// Requer o app servido em http://localhost:4173 (pnpm build && pnpm preview --port 4173).
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { products } from "../src/loja/catalog.js";

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const OUT = new URL("../src/assets/products/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
await ctx.addInitScript(() => { window.__SHOT__ = true; });

const isBlank = (buf) => buf.length < 6000; // PNG quase uniforme comprime muito

let failed = 0;
for (const p of products) {
  let ok = false;
  for (let attempt = 0; attempt < 2 && !ok; attempt++) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}${p.customizeHref}&shot=1`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ".glass-card{visibility:hidden!important}" });
    await page.waitForTimeout(2500);
    const canvas = page.locator("#myThreeJsCanvas, canvas").first();
    const buf = await canvas.screenshot();
    await page.close();
    if (!isBlank(buf)) {
      const { writeFileSync } = await import("node:fs");
      writeFileSync(`${OUT}${p.slug}.png`, buf);
      console.log("ok", p.slug, buf.length);
      ok = true;
    }
  }
  if (!ok) { console.error("BLANK", p.slug); failed++; }
}
await browser.close();
process.exit(failed ? 1 : 0);
