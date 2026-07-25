import { NavLink } from "react-router-dom";
import { Library, PanelTop, Ruler } from "lucide-react";

const TABS = [
  { to: "/", label: "Estante", icon: Library },
  // { to: "/luminaria", label: "Luminária", icon: Lightbulb },
  { to: "/mao-francesa", label: "Mão Francesa", icon: Ruler },
  { to: "/prateleira", label: "Prateleira", icon: PanelTop },
];

const ProductTabs = () => (
  <nav className="flex gap-2 max-w-full overflow-x-auto no-scrollbar">
    {TABS.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end
        className={({ isActive }) =>
          [
            "flex shrink-0 items-center gap-2 px-4 py-2 rounded-2xl text-xs lg:text-sm font-black uppercase tracking-widest transition-all active:scale-95",
            isActive
              ? "bg-amber-900 dark:bg-amber-500 text-amber-50 dark:text-stone-950 shadow-lg"
              : "glass-card text-amber-900/60 dark:text-amber-400/60 hover:text-amber-900 dark:hover:text-amber-400",
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
