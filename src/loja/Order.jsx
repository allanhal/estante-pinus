import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatBRL } from "./money";
import PixPayment from "./PixPayment";
import { btn, card, h1 } from "./ui";

const LABEL = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  expired: "Expirado",
  failed: "Falhou",
  cancelled: "Cancelado",
};

export default function Order() {
  const { code } = useParams();
  const [order, setOrder] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setOrder(null);
    setMissing(false);
    fetch(`/api/orders/${encodeURIComponent(code)}/status`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !cancelled && setOrder(d))
      .catch(() => !cancelled && setMissing(true));
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (missing)
    return (
      <div className="space-y-4">
        <h1 className={h1}>Pedido não encontrado</h1>
        <Link to="/loja" className={btn}>Ver produtos</Link>
      </div>
    );
  if (!order) return <p>Carregando…</p>;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <h1 className={h1}>Pedido #{order.code}</h1>
      <p>Status: <strong>{LABEL[order.status] ?? order.status}</strong></p>
      <ul className={`${card} p-4 text-sm`}>
        {order.items.map((i) => (
          <li key={i.sku} className="flex justify-between"><span>{i.qty}× {i.name}</span><span>{formatBRL(i.unitPrice * i.qty)}</span></li>
        ))}
        <li className="mt-2 flex justify-between border-t border-amber-900/10 dark:border-stone-700/40 pt-2 font-black"><span>Total</span><span>{formatBRL(order.total)}</span></li>
      </ul>
      {order.status === "pending" && order.pixCopyPaste && (
        <PixPayment
          pix={{ code: order.code, total: order.total, pixCopyPaste: order.pixCopyPaste, qrCodeBase64: order.qrCodeBase64 }}
          onPaid={() => setOrder((o) => ({ ...o, status: "paid" }))}
        />
      )}
    </div>
  );
}
