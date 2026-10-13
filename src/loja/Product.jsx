import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "./catalog.js";
import { addToCart } from "./cartStore";
import { formatBRL } from "./money";
import { productImage } from "./images";
import { btn, btnGhost, card, h1, muted } from "./ui";

export default function Product() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const p = getProduct(slug);

  if (!p)
    return (
      <div className="space-y-4">
        <h1 className={h1}>Produto não encontrado</h1>
        <Link to="/loja" className={btn}>Ver produtos</Link>
      </div>
    );

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img src={productImage(p.image)} alt={p.name} className="h-80 w-full rounded-3xl object-cover shadow-xl md:h-[28rem]" />
      <div className="space-y-5">
        <Link to="/loja" className={`text-sm underline ${muted}`}>← Todos os produtos</Link>
        <h1 className={h1}>{p.name}</h1>
        <p className="text-3xl font-black">{formatBRL(p.price)}</p>
        <p>{p.description}</p>
        <dl className={`${card} grid grid-cols-2 gap-2 p-4 text-sm`}>
          <dt className={muted}>Medidas</dt>
          <dd className="font-semibold">{p.dimensionsLabel}</dd>
          <dt className={muted}>Material</dt>
          <dd className="font-semibold">Pinus, ripas 2×4</dd>
        </dl>
        <div className="flex flex-wrap gap-3">
          <button
            className={btn}
            onClick={() => {
              addToCart(p.slug);
              setAdded(true);
            }}
          >
            Adicionar ao carrinho
          </button>
          <Link to={p.customizeHref} className={btnGhost}>Personalizar</Link>
        </div>
        {added && (
          <p role="status" className="font-semibold text-amber-900 dark:text-amber-400">
            Adicionado!{" "}
            <button className="underline" onClick={() => navigate("/loja/carrinho")}>Ver carrinho</button>
          </p>
        )}
      </div>
    </div>
  );
}
