import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { formatBRL } from "./money";
import { btn, card, input, muted } from "./ui";

// pix: { code, total, pixCopyPaste, qrCodeBase64 }
export default function PixPayment({ pix, onPaid }) {
  const [status, setStatus] = useState("pending");
  const [copied, setCopied] = useState(false);
  const [qrSrc, setQrSrc] = useState(null);

  // Prefer the provider's QR; otherwise generate one locally from the copia-e-cola
  // string (never sent to a third-party service).
  useEffect(() => {
    let cancelled = false;
    if (pix.qrCodeBase64) {
      setQrSrc(pix.qrCodeBase64.startsWith("data:") ? pix.qrCodeBase64 : `data:image/png;base64,${pix.qrCodeBase64}`);
    } else {
      QRCode.toDataURL(pix.pixCopyPaste, { width: 256, margin: 1 })
        .then((url) => !cancelled && setQrSrc(url))
        .catch(() => !cancelled && setQrSrc(null));
    }
    return () => {
      cancelled = true;
    };
  }, [pix.qrCodeBase64, pix.pixCopyPaste]);

  useEffect(() => {
    if (status !== "pending") return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/${pix.code}/status`, { cache: "no-store" });
        if (r.ok) {
          const d = await r.json();
          if (d.status !== "pending") {
            setStatus(d.status);
            if (d.status === "paid") onPaid?.();
          }
        }
      } catch {
        /* transient: try again on next tick */
      }
    }, 4000);
    return () => clearInterval(t);
  }, [status, pix.code, onPaid]);

  if (status === "paid")
    return (
      <div className={`${card} space-y-3 p-6`}>
        <h2 className="text-2xl font-black text-amber-900 dark:text-amber-400">Pagamento confirmado!</h2>
        <p>Obrigado pelo pedido <strong>{pix.code}</strong>. Entraremos em contato para combinar a entrega.</p>
        <Link to={`/loja/pedido/${pix.code}`} className={btn}>Ver pedido</Link>
      </div>
    );
  if (status !== "pending")
    return <p className={`${card} p-6`}>Este pedido não está mais ativo ({status}).</p>;

  return (
    <div className={`${card} space-y-4 p-6`}>
      <h2 className="text-2xl font-black text-amber-900 dark:text-amber-400">Pague com PIX</h2>
      <p>Pedido <strong className="font-mono tracking-wider">{pix.code}</strong> · Total: <strong>{formatBRL(pix.total)}</strong></p>
      {qrSrc && <img src={qrSrc} alt="QR Code PIX" className="mx-auto h-56 w-56 rounded-xl bg-white p-2" />}
      <textarea readOnly className={`${input} h-28 font-mono text-xs`} value={pix.pixCopyPaste} aria-label="PIX copia e cola" />
      <button
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(pix.pixCopyPaste);
            setCopied(true);
          } catch {
            /* clipboard blocked: user can select the text */
          }
        }}
      >
        {copied ? "Copiado!" : "Copiar código PIX"}
      </button>
      <p className={`text-sm ${muted}`}>Aguardando pagamento… esta página atualiza sozinha. Guarde o código do pedido: <strong>{pix.code}</strong>.</p>
    </div>
  );
}
