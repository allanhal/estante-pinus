import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import MaoFrancesa3D from "./MaoFrancesa3D";
import MaoFrancesaControls from "./MaoFrancesaControls";
import ProductTabs from "./ProductTabs";
import { useDarkMode } from "./useDarkMode";
import {
  ESPESSURA,
  LARGURA_PECA,
  PRECO_POR_METRO,
  getSupportComprimento,
} from "./ripa";

export { ESPESSURA, LARGURA_PECA, getSupportRun, getSupportComprimento } from "./ripa";

const ALTURA = 30;
const PROFUNDIDADE = 20;
const QUANTIDADE = 1;
const MAO_FRANCESA_MARKUP = 1.2;

export const ALTURA_MINIMA = 15;
export const ALTURA_MAXIMA = 30;

export const PROFUNDIDADE_MINIMA = 13;
export const PROFUNDIDADE_MAXIMA = 30;

export const QUANTIDADE_MINIMA = 1;
export const QUANTIDADE_MAXIMA = 12;

export const calculateMaoFrancesaBillOfMaterials = ({ height, depth, quantity = 1 }) => [
  // O top apoia sobre o wall, então a altura total desconta a espessura da ripa.
  { nome: "Wall", comprimento: height - ESPESSURA, quantidade: quantity },
  { nome: "Top", comprimento: depth, quantidade: quantity },
  {
    nome: "Suporte",
    comprimento: getSupportComprimento(height, depth),
    quantidade: quantity,
  },
];

export const calculateMaoFrancesaPrice = ({ height, depth, quantity }) => {
  const totalLength = calculateMaoFrancesaBillOfMaterials({
    height,
    depth,
    quantity,
  }).reduce((sum, item) => sum + item.comprimento * item.quantidade, 0);
  const material = (totalLength / 100) * PRECO_POR_METRO;

  return Math.round(material * 2 * MAO_FRANCESA_MARKUP);
};

function MaoFrancesa() {
  const [height, setHeight] = useState(ALTURA);
  const [depth, setDepth] = useState(PROFUNDIDADE);
  const [quantity, setQuantity] = useState(QUANTIDADE);
  const [showBom, setShowBom] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const altura = searchParams.get("altura");
    const profundidade = searchParams.get("profundidade");
    const quantidade = searchParams.get("quantidade");
    const bom = searchParams.get("bom");

    // URL pode vir com valor fora de faixa; trava nos limites antes de modelar.
    const clamp = (valor, min, max) => Math.min(Math.max(valor, min), max);

    if (altura) setHeight(clamp(parseInt(altura, 10), ALTURA_MINIMA, ALTURA_MAXIMA));
    if (profundidade) {
      setDepth(clamp(parseInt(profundidade, 10), PROFUNDIDADE_MINIMA, PROFUNDIDADE_MAXIMA));
    }
    if (quantidade) {
      setQuantity(clamp(parseInt(quantidade, 10), QUANTIDADE_MINIMA, QUANTIDADE_MAXIMA));
    }
    if (bom) setShowBom(bom === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = {
      altura: height,
      profundidade: depth,
      quantidade: quantity,
    };

    if (showBom) params.bom = "true";

    setSearchParams(params, { replace: true });
  }, [height, depth, quantity, showBom, setSearchParams]);

  const price = useMemo(
    () => calculateMaoFrancesaPrice({ height, depth, quantity }),
    [height, depth, quantity]
  );

  return (
    <div className="h-screen lg:h-auto lg:min-h-screen bg-[var(--background)] flex flex-col overflow-hidden lg:overflow-visible transition-colors duration-300">
      {/* Header / Hero */}
      <header className="hidden lg:flex pt-10 pb-6 px-6 lg:px-20 items-center justify-between gap-6">
        <h1 className="text-4xl md:text-6xl font-black text-amber-900 dark:text-amber-400 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Mão Francesa Pinus Fortaleza
        </h1>
        <div className="flex items-center gap-3">
          <ProductTabs />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-2xl glass-card hover:scale-105 active:scale-95 transition-all text-amber-900 dark:text-amber-400"
            aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      <div className="lg:hidden bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950 px-4 py-2.5 shrink-0 shadow-md flex items-center justify-between gap-2">
        <ProductTabs />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 rounded-lg text-amber-200 hover:text-amber-50 transition-colors shrink-0"
          aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-8 lg:px-12 pb-0 lg:pb-12 overflow-hidden lg:overflow-visible">
        {/* Left: 3D Scene */}
        <div className="h-[40vh] shrink-0 lg:col-span-7 lg:sticky lg:top-8 lg:h-[80vh] bg-white dark:bg-stone-900 lg:rounded-3xl shadow-2xl lg:shadow-amber-900/10 dark:lg:shadow-black/30 overflow-hidden group lg:self-start transition-colors duration-300">
          <MaoFrancesa3D height={height} depth={depth} />
          <div className="absolute bottom-6 left-6 z-20 hidden lg:block">
            <div className="glass-card px-4 py-2 rounded-full text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest">
              Interação 3D Ativa
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex-1 overflow-y-auto lg:overflow-visible lg:col-span-5 px-4 md:px-6 lg:px-0 lg:mt-0 pt-4 lg:pt-0 relative">
          <div className="bg-white dark:bg-stone-900 lg:bg-white/40 lg:dark:bg-stone-900/40 lg:backdrop-blur-xl rounded-t-[40px] lg:rounded-3xl p-6 lg:p-8 shadow-2xl lg:shadow-none border-t lg:border border-amber-900/5 dark:border-stone-700/30 min-h-[50vh] transition-colors duration-300">
            <MaoFrancesaControls
              height={height}
              depth={depth}
              quantity={quantity}
              showBom={showBom}
              setHeight={setHeight}
              setDepth={setDepth}
              setQuantity={setQuantity}
              minHeight={ALTURA_MINIMA}
              maxHeight={ALTURA_MAXIMA}
              minDepth={PROFUNDIDADE_MINIMA}
              maxDepth={PROFUNDIDADE_MAXIMA}
              minQuantity={QUANTIDADE_MINIMA}
              maxQuantity={QUANTIDADE_MAXIMA}
              price={price}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MaoFrancesa;
