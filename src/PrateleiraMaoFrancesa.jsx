import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import ProductTabs from "./ProductTabs";
import PrateleiraMaoFrancesa3D from "./PrateleiraMaoFrancesa3D";
import PrateleiraMaoFrancesaControls from "./PrateleiraMaoFrancesaControls";
import { useDarkMode } from "./useDarkMode";
import {
  RIPA_ALTURA,
  RIPA_LARGURA,
} from "./App";
import {
  ESPESSURA,
  LARGURA_PECA,
  PRECO_POR_METRO,
  getSupportComprimento,
} from "./ripa";

export { ESPESSURA, LARGURA_PECA, getSupportRun, getSupportComprimento } from "./ripa";
export { RIPA_ALTURA, RIPA_LARGURA } from "./App";

const LARGURA = 80;
const ALTURA = 25;
const PROFUNDIDADE = 20;
const TIRAS_POR_PRATELEIRA = 4;
const QUANTIDADE_MAOS_FRANCESAS = 2;
const PRATELEIRA_MARKUP = 1.25;

export const LARGURA_MINIMA = 50;
export const LARGURA_MAXIMA = 160;

export const ALTURA_MINIMA = 15;
export const ALTURA_MAXIMA = 30;

export const PROFUNDIDADE_MINIMA = 13;
export const PROFUNDIDADE_MAXIMA = 30;

export const TIRAS_POR_PRATELEIRA_MINIMO = 3;

export const calculatePrateleiraMaoFrancesaBillOfMaterials = ({
  width,
  height,
  depth,
  slatsPerShelf,
}) => [
  {
    nome: "Ripas da prateleira",
    comprimento: width - RIPA_LARGURA,
    quantidade: slatsPerShelf,
  },
  { nome: "Wall", comprimento: height - ESPESSURA, quantidade: QUANTIDADE_MAOS_FRANCESAS },
  { nome: "Top", comprimento: depth, quantidade: QUANTIDADE_MAOS_FRANCESAS },
  {
    nome: "Suporte",
    comprimento: getSupportComprimento(height, depth),
    quantidade: QUANTIDADE_MAOS_FRANCESAS,
  },
];

export const calculatePrateleiraMaoFrancesaPrice = ({ width, height, depth, slatsPerShelf }) => {
  const totalLength = calculatePrateleiraMaoFrancesaBillOfMaterials({
    width,
    height,
    depth,
    slatsPerShelf,
  }).reduce((sum, item) => sum + item.comprimento * item.quantidade, 0);
  const material = (totalLength / 100) * PRECO_POR_METRO;

  return Math.round(material * 2 * PRATELEIRA_MARKUP);
};

function PrateleiraMaoFrancesa() {
  const [width, setWidth] = useState(LARGURA);
  const [height, setHeight] = useState(ALTURA);
  const [depth, setDepth] = useState(PROFUNDIDADE);
  const [slatsPerShelf, setSlatsPerShelf] = useState(TIRAS_POR_PRATELEIRA);
  const [showBom, setShowBom] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const largura = searchParams.get("largura");
    const altura = searchParams.get("altura");
    const profundidade = searchParams.get("profundidade");
    const ripas_por_prateleira = searchParams.get("ripas_por_prateleira");
    const bom = searchParams.get("bom");
    const clamp = (valor, min, max) => Math.min(Math.max(valor, min), max);

    if (largura) setWidth(clamp(parseInt(largura, 10), LARGURA_MINIMA, LARGURA_MAXIMA));
    if (altura) setHeight(clamp(parseInt(altura, 10), ALTURA_MINIMA, ALTURA_MAXIMA));
    if (profundidade) {
      setDepth(clamp(parseInt(profundidade, 10), PROFUNDIDADE_MINIMA, PROFUNDIDADE_MAXIMA));
    }
    if (ripas_por_prateleira) {
      setSlatsPerShelf(
        clamp(
          parseInt(ripas_por_prateleira, 10),
          TIRAS_POR_PRATELEIRA_MINIMO,
          Math.floor((profundidade ? parseInt(profundidade, 10) : PROFUNDIDADE) / RIPA_LARGURA)
        )
      );
    }
    if (bom) setShowBom(bom === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = {
      largura: width,
      altura: height,
      profundidade: depth,
      ripas_por_prateleira: slatsPerShelf,
    };

    if (showBom) params.bom = "true";

    setSearchParams(params, { replace: true });
  }, [width, height, depth, slatsPerShelf, showBom, setSearchParams]);

  const price = useMemo(
    () => calculatePrateleiraMaoFrancesaPrice({ width, height, depth, slatsPerShelf }),
    [width, height, depth, slatsPerShelf]
  );

  return (
    <div className="h-screen lg:h-auto lg:min-h-screen bg-[var(--background)] flex flex-col overflow-hidden lg:overflow-visible transition-colors duration-300">
      <header className="hidden lg:flex pt-10 pb-6 px-6 lg:px-20 items-center justify-between gap-6">
        <h1 className="min-w-0 text-4xl md:text-6xl font-black text-amber-900 dark:text-amber-400 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Prateleira Pinus Fortaleza
        </h1>
        <div className="flex min-w-0 items-center justify-end gap-3 flex-wrap">
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
        <div className="h-[40vh] shrink-0 lg:col-span-7 lg:sticky lg:top-8 lg:h-[80vh] bg-white dark:bg-stone-900 lg:rounded-3xl shadow-2xl lg:shadow-amber-900/10 dark:lg:shadow-black/30 overflow-hidden group lg:self-start transition-colors duration-300">
          <PrateleiraMaoFrancesa3D
            width={width}
            height={height}
            depth={depth}
            slatsPerShelf={slatsPerShelf}
          />
          <div className="absolute bottom-6 left-6 z-20 hidden lg:block">
            <div className="glass-card px-4 py-2 rounded-full text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest">
              Interação 3D Ativa
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto lg:overflow-visible lg:col-span-5 px-4 md:px-6 lg:px-0 lg:mt-0 pt-4 lg:pt-0 relative">
          <div className="bg-white dark:bg-stone-900 lg:bg-white/40 lg:dark:bg-stone-900/40 lg:backdrop-blur-xl rounded-t-[40px] lg:rounded-3xl p-6 lg:p-8 shadow-2xl lg:shadow-none border-t lg:border border-amber-900/5 dark:border-stone-700/30 min-h-[50vh] transition-colors duration-300">
            <PrateleiraMaoFrancesaControls
              width={width}
              height={height}
              depth={depth}
              slatsPerShelf={slatsPerShelf}
              showBom={showBom}
              setWidth={setWidth}
              setHeight={setHeight}
              setDepth={setDepth}
              setSlatsPerShelf={setSlatsPerShelf}
              minWidth={LARGURA_MINIMA}
              maxWidth={LARGURA_MAXIMA}
              minHeight={ALTURA_MINIMA}
              maxHeight={ALTURA_MAXIMA}
              minDepth={PROFUNDIDADE_MINIMA}
              maxDepth={PROFUNDIDADE_MAXIMA}
              minSlatsPerShelf={TIRAS_POR_PRATELEIRA_MINIMO}
              price={price}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrateleiraMaoFrancesa;
