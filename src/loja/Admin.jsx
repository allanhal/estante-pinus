import { useCallback, useEffect, useState } from "react";
import { formatBRL } from "./money";
import { btn, btnGhost, card, h1, input, muted } from "./ui";

export default function Admin() {
  const [orders, setOrders] = useState(null); // null = loading, false = logged out
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/orders", { cache: "no-store" });
      if (r.status === 401) return setOrders(false);
      if (!r.ok) throw new Error();
      setOrders((await r.json()).orders);
    } catch {
      setLoadError("Não foi possível carregar os pedidos (a API /api só roda no Vercel ou com `vercel dev`).");
      setOrders(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function login(e) {
    e.preventDefault();
    setError("");
    const password = String(new FormData(e.currentTarget).get("password"));
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (r?.ok) load();
    else setError("Senha incorreta");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setOrders(false);
  }

  if (orders === null) return <p>Carregando…</p>;
  if (orders === false)
    return (
      <form className="mx-auto max-w-sm space-y-3" onSubmit={login}>
        <h1 className={h1}>Admin</h1>
        <input name="password" type="password" className={input} placeholder="Senha" required autoFocus />
        {loadError && <p className={`text-sm ${muted}`}>{loadError}</p>}
        {error && <p role="alert" className="text-red-600 dark:text-red-400">{error}</p>}
        <button className={`${btn} w-full`}>Entrar</button>
      </form>
    );

  const paid = orders.filter((o) => o.status === "paid");
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className={h1}>Pedidos</h1>
        <div className="flex gap-2">
          <button className={btnGhost} onClick={load}>Atualizar</button>
          <button className={btnGhost} onClick={logout}>Sair</button>
        </div>
      </div>
      <p className={muted}>
        {orders.length} pedidos · {paid.length} pagos · {formatBRL(paid.reduce((s, o) => s + Number(o.total), 0))} recebidos
      </p>
      <div className="space-y-3">
        {orders.map((o) => (
          <details key={o.id} className={`${card} p-4`}>
            <summary className="flex cursor-pointer flex-wrap justify-between gap-2 font-semibold">
              <span>#{o.code} · {o.customer.name}</span>
              <span>{o.status.toUpperCase()} · {formatBRL(Number(o.total))} · {new Date(o.created_at).toLocaleString("pt-BR")}</span>
            </summary>
            <div className="mt-3 space-y-1 text-sm">
              <p>{o.customer.email} · {o.customer.phone} · CPF {o.customer.cpf}</p>
              {o.address && (
                <p>{o.address.street}, {o.address.number} {o.address.complement} — {o.address.city}/{o.address.state} · CEP {o.address.cep}</p>
              )}
              <ul>{o.items.map((i) => <li key={i.sku}>{i.qty}× {i.name} ({formatBRL(i.unitPrice)})</li>)}</ul>
              {o.paid_at && <p>Pago em {new Date(o.paid_at).toLocaleString("pt-BR")}</p>}
            </div>
          </details>
        ))}
        {!orders.length && <p>Nenhum pedido ainda.</p>}
      </div>
    </div>
  );
}
