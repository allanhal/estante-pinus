import { useState } from "react";
import {
  COMPRIMENTO_BARRA,
  ESPESSURA_SERRA,
  calculatePlanoDeCorte,
} from "./ripa";

const formatCm = (value) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const formatBRL = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Custo da barra é configuração de quem corta, então fica no navegador (por bitola),
// valendo para todos os produtos que usam a mesma ripa.
const storageKey = (bitola) => `custo_barra_${bitola}`;

const readCusto = (bitola) => {
  try {
    return localStorage.getItem(storageKey(bitola)) ?? "";
  } catch {
    return "";
  }
};

const PlanoDeCorte = ({ items, bitola, mostrarCusto = false }) => {
  const { barras, padroes } = calculatePlanoDeCorte(items);
  const [custoBarra, setCustoBarra] = useState(() => readCusto(bitola));

  const handleCustoChange = (value) => {
    setCustoBarra(value);
    try {
      localStorage.setItem(storageKey(bitola), value);
    } catch {
      // Sem storage o valor só vale para esta visita.
    }
  };

  const custoNumber = parseFloat(custoBarra.replace(",", "."));

  return (
    <div className="mt-4 space-y-1">
      <p className="text-xs font-bold text-amber-900/60 dark:text-amber-500/60 uppercase tracking-widest">
        Ripa {bitola}cm: {barras} barra(s) de {COMPRIMENTO_BARRA}cm
      </p>
      <ul className="text-xs font-medium text-amber-900/50 dark:text-amber-500/50 space-y-0.5">
        {padroes.map((padrao) => (
          <li key={padrao.pecas.join("+")}>
            {padrao.quantidade}× {padrao.pecas.join(" + ")}cm (sobra{" "}
            {formatCm(padrao.sobra)}cm)
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-amber-900/40 dark:text-amber-500/40">
        Considera {formatCm(ESPESSURA_SERRA * 10)}mm perdidos por corte de
        serra.
      </p>
      {mostrarCusto && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs font-medium text-amber-900/60 dark:text-amber-500/60">
            Custo por barra (R$)
            <input
              type="text"
              inputMode="decimal"
              value={custoBarra}
              onChange={(e) => handleCustoChange(e.target.value)}
              placeholder="0,00"
              className="w-20 rounded-lg border border-amber-900/10 dark:border-stone-700/30 bg-transparent px-2 py-1 text-right text-sm font-bold text-amber-900 dark:text-amber-400 focus:ring-0"
            />
          </label>
          {custoNumber > 0 && (
            <span className="text-sm font-black text-amber-900 dark:text-amber-400">
              Custo: {formatBRL(barras * custoNumber)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanoDeCorte;
