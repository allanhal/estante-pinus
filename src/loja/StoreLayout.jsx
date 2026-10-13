import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Moon, ShoppingCart, Sun } from "lucide-react";
import ProductTabs from "../ProductTabs";
import { useDarkMode } from "../useDarkMode";
import { useCart } from "./cartStore";

// Same header + tabs as the configurators, so "Customize" is always one tap away.
export default function StoreLayout() {
  const [darkMode, setDarkMode] = useDarkMode();
  const lines = useCart();
  const { pathname } = useLocation();
  const count = lines.reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggle = (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-3 rounded-2xl glass-card hover:scale-105 active:scale-95 transition-all text-amber-900 dark:text-amber-400"
      aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {darkMode ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
  const cart = (
    <Link
      to="/loja/carrinho"
      aria-label={`Carrinho (${count})`}
      className="relative p-3 rounded-2xl glass-card hover:scale-105 active:scale-95 transition-all text-amber-900 dark:text-amber-400"
    >
      <ShoppingCart size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 rounded-full bg-amber-600 px-1.5 text-center text-[11px] font-black leading-5 text-white">
          {count}
        </span>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <header className="flex flex-wrap items-center justify-between gap-4 px-4 pt-4 pb-4 md:px-12 lg:px-20 lg:pt-10">
        <Link
          to="/loja"
          className="min-w-0 text-2xl md:text-4xl lg:text-6xl font-black text-amber-900 dark:text-amber-400 leading-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Estante Pinus Fortaleza
        </Link>
        <div className="flex min-w-0 items-center justify-end gap-3 flex-wrap">
          <ProductTabs />
          {cart}
          {toggle}
        </div>
      </header>
      <main className="px-4 pb-16 md:px-12 lg:px-20">
        <Outlet />
      </main>
      <footer className="px-4 pb-10 text-center text-xs text-[var(--text-muted)] md:px-12 lg:px-20">
        Estante Pinus Fortaleza · Pagamento via PIX ·{" "}
        <Link to="/" className="underline">Personalizar sob medida</Link>
      </footer>
    </div>
  );
}
