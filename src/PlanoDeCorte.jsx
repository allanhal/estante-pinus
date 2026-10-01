import { COMPRIMENTO_BARRA, ESPESSURA_SERRA, calculatePlanoDeCorte } from "./ripa";

const formatCm = (value) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

const PlanoDeCorte = ({ items, titulo }) => {
  const { barras, padroes } = calculatePlanoDeCorte(items);

  return (
    <div className="mt-4 space-y-1">
      <p className="text-xs font-bold text-amber-900/60 dark:text-amber-500/60 uppercase tracking-widest">
        {titulo ? `${titulo}: ` : ""}
        {barras} barra(s) de {COMPRIMENTO_BARRA}cm
      </p>
      <ul className="text-xs font-medium text-amber-900/50 dark:text-amber-500/50 space-y-0.5">
        {padroes.map((padrao) => (
          <li key={padrao.pecas.join("+")}>
            {padrao.quantidade}× {padrao.pecas.join(" + ")}cm (sobra {formatCm(padrao.sobra)}cm)
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-amber-900/40 dark:text-amber-500/40">
        Considera {formatCm(ESPESSURA_SERRA * 10)}mm perdidos por corte de serra.
      </p>
    </div>
  );
};

export default PlanoDeCorte;
