import { useCallback, useEffect, useState } from "react";

const KEY = "loja-cart-v1";
const EVT = "loja-cart-change";

export function readCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((l) => l && typeof l.sku === "string" && Number.isInteger(l.qty) && l.qty > 0)
      : [];
  } catch {
    return [];
  }
}

function writeCart(lines) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage blocked: cart just won't persist */
  }
  window.dispatchEvent(new Event(EVT));
}

export const addToCart = (sku, qty = 1) => {
  const lines = readCart();
  const found = lines.find((l) => l.sku === sku);
  if (found) found.qty = Math.min(found.qty + qty, 20);
  else lines.push({ sku, qty });
  writeCart(lines);
};
export const setQty = (sku, qty) =>
  writeCart(readCart().map((l) => (l.sku === sku ? { ...l, qty } : l)).filter((l) => l.qty > 0));
export const removeFromCart = (sku) => writeCart(readCart().filter((l) => l.sku !== sku));
export const clearCart = () => writeCart([]);

export function useCart() {
  const [lines, setLines] = useState(readCart);
  const refresh = useCallback(() => setLines(readCart()), []);
  useEffect(() => {
    window.addEventListener(EVT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);
  return lines;
}
