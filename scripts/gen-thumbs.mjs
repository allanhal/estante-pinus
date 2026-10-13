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

const stats = {};
const mp = await ctx.newPage();
// Mede o PNG: cantos escuros? bbox/area dos pixels diferentes do fundo.
const measure = (buf) => mp.evaluate(async (b64) => {
  const img = new Image();
  img.src = "data:image/png;base64," + b64;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const px = (x, y) => { const i = (y * c.width + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };
  const corners = [px(2, 2), px(c.width - 3, 2), px(2, c.height - 3), px(c.width - 3, c.height - 3)];
  const cornersDark = corners.every((p) => p[0] < 50 && p[1] < 50 && p[2] < 50);
  const [br, bg, bb] = corners[0];
  let minX = c.width, minY = c.height, maxX = 0, maxY = 0, count = 0;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4;
    if (Math.abs(d[i] - br) + Math.abs(d[i + 1] - bg) + Math.abs(d[i + 2] - bb) > 24) {
      count++; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
  return { w: c.width, h: c.height, corner: corners[0], cornersDark, bboxH: maxY - minY + 1, bboxW: maxX - minX + 1, fill: +(count / (c.width * c.height)).toFixed(3) };
}, buf.toString("base64"));

let failed = 0;
for (const p of products) {
  let ok = false;
  for (let attempt = 0; attempt < 2 && !ok; attempt++) {
    const page = await ctx.newPage();
    const qty = p.dimensions.quantidade ?? 1;
    await page.addInitScript((q) => { window.__SHOT_QTY__ = q; }, qty);
    await page.goto(`${BASE}${p.customizeHref}&shot=1`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ".glass-card{visibility:hidden!important}" });
    await page.waitForTimeout(2500);
    const canvas = page.locator("#myThreeJsCanvas, canvas").first();
    // recorte quadrado centrado no canvas (sem cantos arredondados do container)
    await page.addStyleTag({ content: "*{border-radius:0!important}" });
    const b = await canvas.boundingBox();
    const side = Math.floor(Math.min(b.width, b.height));
    const buf = await page.screenshot({ clip: { x: b.x + (b.width - side) / 2, y: b.y + (b.height - side) / 2, width: side, height: side } });
    await page.close();
    if (!isBlank(buf)) {
      const { writeFileSync } = await import("node:fs");
      writeFileSync(`${OUT}${p.slug}.png`, buf);
      const m = await measure(buf);
      stats[p.slug] = m;
      console.log("ok", p.slug, buf.length, JSON.stringify(m));
      if (!m.cornersDark) { console.error("BG NOT DARK", p.slug); failed++; }
      ok = true;
    }
  }
  if (!ok) { console.error("BLANK", p.slug); failed++; }
}
await mp.close();
const sm = stats["estante-pequena-60x120"], lg = stats["estante-grande-180x200"];
if (sm && lg) {
  console.log(`proporcao: pequena bboxH=${sm.bboxH} fill=${sm.fill} | grande bboxH=${lg.bboxH} fill=${lg.fill}`);
  if (!(lg.bboxH > sm.bboxH * 1.3 && lg.fill > sm.fill * 1.3)) { console.error("NOT PROPORTIONAL"); failed++; }
}
await browser.close();
process.exit(failed ? 1 : 0);
