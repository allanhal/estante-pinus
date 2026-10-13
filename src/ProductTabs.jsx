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

const ProductTabs = () => (
  <nav className="flex w-full lg:w-auto min-w-0 flex-nowrap items-center justify-center lg:justify-end gap-1 rounded-2xl bg-white/55 dark:bg-stone-900/55 p-1 border border-amber-900/5 dark:border-stone-700/40 shadow-sm">
    {TABS.map(({ to, label, icon: Icon, nested, highlight }) => (
      <NavLink
        key={to}
        aria-label={label}
        to={to}
        end={!nested}
        className={({ isActive }) =>
          [
            "flex shrink-0 items-center justify-center gap-1.5 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all active:scale-95",
            highlight ? "px-3 lg:px-4 py-2" : "px-2.5 lg:px-3 py-2",
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
            {/* No celular só a aba ativa mostra o nome — exceto a Loja, que sempre aparece. */}
            <span className={isActive || highlight ? "" : "hidden lg:inline"}>{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

export default ProductTabs;
