import { describe, expect, it } from "vitest";
import * as pricing from "../../pricing.js";
import { products } from "../catalog.js";
import { formatBRL } from "../money";
import { addToCart, readCart, removeFromCart, setQty, clearCart } from "../cartStore";
import { productImage } from "../images";

describe("pricing", () => {
  const finite = (n) => expect(Number.isFinite(n)).toBe(true);
  it("formulas retornam numeros finitos", () => {
    finite(pricing.calculateShelfBasePrice({ width: 100, height: 180, shelves: 4, slatsPerShelf: 4 }));
    finite(pricing.calculateApoiosCentraisPrice({ width: 180, height: 200, depth: 35, shelves: 4 }));
    finite(pricing.calculateReforcoPrice({ width: 120, depth: 30, shelves: 4 }));
    finite(pricing.calculateMaoFrancesaPrice({ height: 30, depth: 20, quantity: 2 }));
    finite(pricing.calculatePrateleiraMaoFrancesaPrice({ width: 80, height: 25, depth: 20, slatsPerShelf: 4 }));
    finite(pricing.getNumPrateleiras({ height: 180, spacePerShelf: 40, reforcada: false }));
  });
});

describe("catalog", () => {
  it("slugs unicos", () => expect(new Set(products.map((p) => p.slug)).size).toBe(products.length));
  it.each(products.map((p) => [p.slug, p]))("%s esta completo", (_s, p) => {
    expect(Number.isFinite(p.price) && p.price > 0).toBe(true);
    expect(p.name).toBeTruthy();
    expect(typeof p.customizeHref).toBe("string");
    expect(p.dimensionsLabel).toBeTruthy();
    expect(p.slug).toBeTruthy();
    expect(productImage(p.slug)).toBeTruthy();
  });
});

describe("money", () => {
  it("formatBRL", () => expect(formatBRL(110)).toMatch(/R\$\s?110,00/));
});

describe("cartStore", () => {
  it("add/read/setQty/remove", () => {
    clearCart();
    addToCart("a");
    addToCart("a");
    addToCart("b", 3);
    expect(readCart()).toEqual([{ sku: "a", qty: 2 }, { sku: "b", qty: 3 }]);
    setQty("a", 5);
    expect(readCart().find((l) => l.sku === "a").qty).toBe(5);
    removeFromCart("a");
    expect(readCart()).toEqual([{ sku: "b", qty: 3 }]);
    setQty("b", 0);
    expect(readCart()).toEqual([]);
  });
});
