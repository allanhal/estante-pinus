import { Link } from "react-router-dom";
import { CATEGORY_LABELS, products } from "./catalog.js";
import { heroImages } from "./images";
import ProductCard from "./ProductCard";
import { h1, btn } from "./ui";

export default function Home() {
  return (
    <div className="space-y-14">
      <section
        aria-label="Destaque"
        className="relative isolate overflow-hidden rounded-3xl bg-cover bg-center text-white shadow-lg"
        style={{ backgroundImage: `url(${heroImages.bg})` }}
      >
        {/* wood-toned overlay keeps text readable in light and dark mode */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-950/90 via-amber-900/70 to-amber-800/20" />
        <div
          aria-hidden
          className="absolute -right-10 bottom-0 -z-10 hidden h-4/5 w-1/3 rounded-tl-[3rem] bg-cover bg-center opacity-90 shadow-2xl md:block"
          style={{ backgroundImage: `url(${heroImages.orange})` }}
        />
        <div className="flex min-h-[22rem] flex-col justify-center px-6 py-12 sm:min-h-[28rem] sm:px-12 lg:px-16">
          <span className="mb-4 w-fit rounded-full bg-amber-400/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-950">
            Feito à mão em Fortaleza
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
            Móveis de pinus, prontos pra entrega
          </h1>
          <p className="mt-4 max-w-xl text-base text-amber-50/90 sm:text-lg">
            Estantes, prateleiras e mãos francesas de madeira maciça. Escolha, pague com PIX e receba em casa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#produtos" className={`${btn} !bg-amber-400 !text-amber-950`}>Ver produtos</a>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/80 px-5 py-3 text-xs font-black uppercase tracking-[0.1em] text-white transition-all hover:bg-white/10 active:scale-95"
            >
              Personalizar sob medida
            </Link>
          </div>
        </div>
      </section>

      <div id="produtos" className="space-y-12 scroll-mt-6">
        {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
          <section key={cat} id={cat}>
            <h2 className={`${h1} mb-4 !text-2xl`}>{label}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.filter((p) => p.category === cat).map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
