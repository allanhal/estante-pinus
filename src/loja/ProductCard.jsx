import { Link } from "react-router-dom";
import { addToCart } from "./cartStore";
import { formatBRL } from "./money";
import { productImage } from "./images";
import { btn, card, muted } from "./ui";

export default function ProductCard({ p }) {
  return (
    <article className={`${card} flex flex-col overflow-hidden`}>
      <Link to={`/loja/produto/${p.slug}`}>
        <img src={productImage(p.slug)} alt={p.name} loading="lazy" className="h-48 w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link to={`/loja/produto/${p.slug}`} className="text-lg font-black text-amber-900 dark:text-amber-400">
          {p.name}
        </Link>
        <p className={`text-sm ${muted}`}>{p.dimensionsLabel}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-xl font-black">{formatBRL(p.price)}</span>
          <button className={btn} onClick={() => addToCart(p.slug)}>Adicionar</button>
        </div>
      </div>
    </article>
  );
}
