import { NavLink } from "react-router-dom";
import { PanelTop, Rows3, TriangleRight } from "lucide-react";

const TABS = [
  { to: "/", label: "Estante", icon: Rows3 },
  { to: "/mao-francesa", label: "Mão Francesa", icon: TriangleRight },
  { to: "/prateleira", label: "Prateleira", icon: PanelTop },
];

const ProductTabs = () => (
  <nav className="flex w-full lg:w-auto min-w-0 flex-nowrap justify-center lg:justify-end gap-1 rounded-2xl bg-white/55 dark:bg-stone-900/55 p-1 border border-amber-900/5 dark:border-stone-700/40 shadow-sm">
    {TABS.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end
        className={({ isActive }) =>
          [
            "flex shrink-0 items-center justify-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all active:scale-95",
            isActive
              ? "bg-amber-900 dark:bg-amber-500 text-amber-50 dark:text-stone-950 shadow-md"
              : "text-amber-900/65 dark:text-amber-400/65 hover:bg-amber-900/5 dark:hover:bg-amber-400/10 hover:text-amber-900 dark:hover:text-amber-400",
          ].join(" ")
        }
      >
        <Icon size={16} />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default ProductTabs;
