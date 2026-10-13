import { Link } from "react-router-dom";
import { getProduct } from "./catalog.js";
import { removeFromCart, setQty, useCart } from "./cartStore";
import { formatBRL } from "./money";
import { btn, btnGhost, card, h1, muted } from "./ui";

export default function Cart() {
  const lines = useCart();
  const rows = lines.flatMap((l) => {
    const p = getProduct(l.sku);
    return p ? [{ p, qty: l.qty }] : [];
  });
  const subtotal = rows.reduce((s, r) => s + r.p.price * r.qty, 0);

  if (!rows.length)
    return (
      <div className="space-y-4">
        <h1 className={h1}>Carrinho</h1>
        <p>Seu carrinho está vazio.</p>
        <Link to="/loja" className={btn}>Ver produtos</Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className={h1}>Carrinho</h1>
      <ul className={`${card} divide-y divide-amber-900/10 dark:divide-stone-700/40`}>
        {rows.map(({ p, qty }) => (
          <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link to={`/loja/produto/${p.slug}`} className="font-bold">{p.name}</Link>
              <p className={`text-sm ${muted}`}>{p.dimensionsLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className={`${btnGhost} !px-3 !py-1`} aria-label="Diminuir" onClick={() => setQty(p.slug, qty - 1)}>−</button>
              <span className="w-6 text-center font-bold">{qty}</span>
              <button className={`${btnGhost} !px-3 !py-1`} aria-label="Aumentar" onClick={() => setQty(p.slug, Math.min(qty + 1, 20))}>+</button>
              <span className="w-24 text-right font-bold">{formatBRL(p.price * qty)}</span>
              <button className={`text-sm underline ${muted}`} onClick={() => removeFromCart(p.slug)}>remover</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xl font-black">Subtotal: {formatBRL(subtotal)}</p>
        <Link to="/loja/checkout" className={btn}>Finalizar compra</Link>
      </div>
    </div>
  );
}
