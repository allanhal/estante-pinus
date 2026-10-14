import { NavLink } from "react-router-dom";
import { PanelTop, Rows3, Shield, ShoppingBag, TriangleRight } from "lucide-react";

const TABS = [
  { to: "/", label: "Estante", icon: Rows3 },
  { to: "/estante-reforcada", label: "Reforçada", icon: Shield },
  { to: "/mao-francesa", label: "Mão Francesa", icon: TriangleRight },
  { to: "/prateleira", label: "Prateleira", icon: PanelTop },
  // Sem `end`: continua ativa em /loja/produto/..., /loja/carrinho etc.
  // `highlight`: a Loja é a aba de compra, então ganha destaque próprio.
  { to: "/loja", label: "Loja", icon: ShoppingBag, nested: true, highlight: true },
];

// Largura-base do wrapper (12rem) >= nav só com ícones, então nunca estoura.
// Os rótulos aparecem conforme o ESPAÇO REAL do wrapper (container query), não
// conforme a viewport: o título grande da loja rouba espaço em qualquer largura.
//   < 16rem  : só ícones
//   >= 16rem : + rótulo da Loja
//   >= 24rem : + rótulo da aba ativa
//   >= 40rem : todos os rótulos
const ProductTabs = () => (
  <div className="@container min-w-0 grow basis-[12rem]">
  <nav className="ml-auto flex w-max max-w-full flex-nowrap items-center gap-0.5 @min-[24rem]:gap-1 rounded-2xl bg-white/55 dark:bg-stone-900/55 p-1.5 border border-amber-900/5 dark:border-stone-700/40 shadow-sm">
    {TABS.map(({ to, label, icon: Icon, nested, highlight }) => (
      <NavLink
        key={to}
        aria-label={label}
        to={to}
        end={!nested}
        className={({ isActive }) =>
          [
            "flex shrink-0 items-center justify-center gap-1.5 rounded-xl text-[10px] @min-[40rem]:text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all active:scale-95",
            highlight ? "px-2.5 @min-[40rem]:px-4 py-2" : "px-2 @min-[40rem]:px-3 py-2",
            highlight
              // Aba de compra: sempre preenchida e chamativa (emerald), mais forte quando ativa.
              ? [
                  "text-white shadow-md ring-1 ring-emerald-400/40",
                  isActive
                    ? "bg-emerald-600 dark:bg-emerald-500 dark:text-stone-950 scale-[1.03]"
                    : "bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.03] dark:bg-emerald-600 dark:hover:bg-emerald-500",
                ].join(" ")
              : isActive
              ? "bg-amber-900 dark:bg-amber-500 text-amber-50 dark:text-stone-950 shadow-md"
              : "text-amber-900/65 dark:text-amber-400/65 hover:bg-amber-900/5 dark:hover:bg-amber-400/10 hover:text-amber-900 dark:hover:text-amber-400",
          ].join(" ")
        }
      >
        {({ isActive }) => (
          <>
            <Icon size={16} />
            {/* Rótulos por container query (ver acima); a Loja é a última a perder o nome. */}
            <span className={isActive ? "hidden @min-[24rem]:inline" : highlight ? "hidden @min-[16rem]:inline" : "hidden @min-[40rem]:inline"}>{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
  </div>
);

export default ProductTabs;
