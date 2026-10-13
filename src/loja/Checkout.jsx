import { useState } from "react";
import { Link } from "react-router-dom";
import { getProduct } from "./catalog.js";
import { clearCart, useCart } from "./cartStore";
import { formatBRL } from "./money";
import PixPayment from "./PixPayment";
import { btn, card, h1, input, muted } from "./ui";

const Field = ({ label, name, required = true, ...rest }) => (
  <label className="block space-y-1 text-sm font-semibold">
    <span>{label}</span>
    <input name={name} className={`${input} font-normal`} required={required} {...rest} />
  </label>
);

export default function Checkout() {
  const lines = useCart();
  const [pix, setPix] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = lines.flatMap((l) => {
    const p = getProduct(l.sku);
    return p ? [{ p, qty: l.qty }] : [];
  });
  const subtotal = rows.reduce((s, r) => s + r.p.price * r.qty, 0);

  async function lookupCep(cep, form) {
    const d = cep.replace(/\D/g, "");
    if (d.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await r.json();
      if (j.erro) return;
      const set = (n, v) => {
        const el = form.elements.namedItem(n);
        if (el && v) el.value = v;
      };
      set("street", j.logradouro);
      set("city", j.localidade);
      set("state", j.uf);
    } catch {
      /* ViaCEP down: user fills the address by hand */
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const g = (k) => String(f.get(k) ?? "");
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines,
          customer: { name: g("name"), email: g("email"), phone: g("phone"), cpf: g("cpf") },
          address: { cep: g("cep"), street: g("street"), number: g("number"), complement: g("complement"), city: g("city"), state: g("state") },
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Erro ao criar pedido");
      setPix(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  if (pix) return <div className="mx-auto max-w-xl"><PixPayment pix={pix} onPaid={clearCart} /></div>;
  if (!rows.length)
    return (
      <div className="space-y-4">
        <h1 className={h1}>Checkout</h1>
        <p>Seu carrinho está vazio.</p>
        <Link to="/loja" className={btn}>Ver produtos</Link>
      </div>
    );

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <form onSubmit={submit} className="space-y-6">
        <h1 className={h1}>Checkout</h1>
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 text-xl font-bold">Seus dados</legend>
          <Field label="Nome completo" name="name" autoComplete="name" />
          <Field label="E-mail" name="email" type="email" autoComplete="email" />
          <Field label="Telefone" name="phone" inputMode="tel" autoComplete="tel" placeholder="(85) 99999-9999" />
          <Field label="CPF" name="cpf" inputMode="numeric" placeholder="000.000.000-00" />
        </fieldset>
        <fieldset className="grid gap-3 sm:grid-cols-6">
          <legend className="mb-2 text-xl font-bold">Entrega</legend>
          <div className="sm:col-span-2"><Field label="CEP" name="cep" inputMode="numeric" autoComplete="postal-code" onBlur={(e) => lookupCep(e.target.value, e.target.form)} /></div>
          <div className="sm:col-span-4"><Field label="Rua" name="street" autoComplete="address-line1" /></div>
          <div className="sm:col-span-2"><Field label="Número" name="number" /></div>
          <div className="sm:col-span-4"><Field label="Complemento" name="complement" required={false} /></div>
          <div className="sm:col-span-4"><Field label="Cidade" name="city" autoComplete="address-level2" /></div>
          <div className="sm:col-span-2"><Field label="UF" name="state" maxLength={2} autoComplete="address-level1" /></div>
        </fieldset>
        {error && <p role="alert" className="font-semibold text-red-600 dark:text-red-400">{error}</p>}
        <button className={`${btn} w-full`} disabled={busy}>{busy ? "Gerando PIX…" : "Gerar PIX"}</button>
      </form>
      <aside className={`${card} h-fit space-y-2 p-5`}>
        <h2 className="text-xl font-bold">Resumo</h2>
        {rows.map(({ p, qty }) => (
          <p key={p.slug} className="flex justify-between gap-2 text-sm"><span>{qty}× {p.name}</span><span>{formatBRL(p.price * qty)}</span></p>
        ))}
        <p className="flex justify-between border-t border-amber-900/10 dark:border-stone-700/40 pt-2 font-black"><span>Total</span><span>{formatBRL(subtotal)}</span></p>
        <p className={`text-xs ${muted}`}>O total final é confirmado pelo servidor.</p>
      </aside>
    </div>
  );
}
