import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom: sem layout / observers / scroll / matchMedia
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} };
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
// navegadores recentes devolvem Promise de scrollTo (nao undefined): o stub imita isso
window.scrollTo = () => Promise.resolve();
window.matchMedia ??= (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });

let errorSpy;
beforeEach(() => {
  localStorage.clear();
  // a API /api so existe no Vercel: respostas falsas e silenciosas
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 404, json: async () => ({}) }));
  errorSpy = vi.spyOn(console, "error");
});
afterEach(() => {
  cleanup();
  const calls = errorSpy.mock.calls.map((c) => String(c[0]));
  errorSpy.mockRestore();
  if (calls.length) throw new Error("console.error durante o teste: " + calls.join(" | ").slice(0, 500));
});
