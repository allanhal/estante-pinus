import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Shelf3D from "./Shelf3D";
import Controls from "./Controls";
import ProductTabs from "./ProductTabs";
import { useDarkMode } from "./useDarkMode";

export const FRETE_FIXO_CAMINHAO = 70;
export const FRETE_FIXO_CARRO = 40;
export const FRETE_FIXO_MOTO = 20;
export const CUSTO_FIXO_MONTAGEM_ESTANTE = 10;

export const RIPA_LARGURA = 4;
export const RIPA_ALTURA = 2;

export const SPAN_MAXIMO = 150;

const ALTURA = 60;
const LARGURA = 40;
const PROFUNDIDADE = 30;
const PRATELEIRAS = 4;
const TIRAS_POR_PRATELEIRA = 4;

const LARGURA_MINIMA = 30;
const LARGURA_MAXIMA = 200;

const ALTURA_MAXIMA = 250;

const PROFUNDIDADE_MINIMA = 20;
const PROFUNDIDADE_MAXIMA = 50;

const PRATELEIRAS_MINIMO = 2;

const TIRAS_POR_PRATELEIRA_MINIMO = 3;

const DISTANCIA_ENTRE_PRATELEIRAS = 20; // Distância entre as prateleiras
const ESPACO_POR_PRATELEIRA_MINIMO = 10;
const ESPACO_POR_PRATELEIRA_MAXIMO = 50;

export const getNumApoiosCentrais = (width) =>
  Math.max(Math.ceil(width / SPAN_MAXIMO) - 1, 0);

const MATERIAL_RATE = 10 / 300; // mesma taxa usada no preço base: R$10 a cada 300cm de material

export const calculateShelfBasePrice = ({ width, height, shelves, slatsPerShelf }) => {
  const totalSlatLength = shelves * slatsPerShelf * (width - RIPA_LARGURA);
  const totalLegLength = height * 4;
  const totalLength = totalSlatLength + totalLegLength;

  return Math.round(totalLength / 300) * 10 + 10;
};

export const calculateApoiosCentraisPrice = ({ width, height, depth, shelves }) => {
  const numApoiosCentrais = getNumApoiosCentrais(width);

  if (numApoiosCentrais === 0) return 0;

  const legsLength = height * numApoiosCentrais * 2;
  const runnersLength = depth * numApoiosCentrais * shelves;

  return Math.round((legsLength + runnersLength) * MATERIAL_RATE);
};

export const calculateBillOfMaterials = ({ width, height, depth, shelves, slatsPerShelf }) => {
  const numApoiosCentrais = getNumApoiosCentrais(width);

  const items = [
    { nome: "Pernas", comprimento: height, quantidade: 4 + numApoiosCentrais * 2 },
  ];

  items.push({
    nome: "Ripas das prateleiras",
    comprimento: width - RIPA_LARGURA,
    quantidade: shelves * slatsPerShelf,
  });

  items.push({
    nome: "Travessas da base",
    comprimento: depth,
    quantidade: shelves * (2 + numApoiosCentrais),
  });

  return items;
};

function App() {
  const [width, setWidth] = useState(LARGURA);
  const [height, setHeight] = useState(ALTURA);
  const [depth, setDepth] = useState(PROFUNDIDADE);
  const [shelves, setShelves] = useState(PRATELEIRAS);
  const [slatsPerShelf, setSlatsPerShelf] = useState(TIRAS_POR_PRATELEIRA);
  const [spacePerShelf, setSpacePerShelf] = useState(DISTANCIA_ENTRE_PRATELEIRAS);
  const [pernasLateral, setPernasLateral] = useState(true);
  const [showBom, setShowBom] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const altura = searchParams.get("altura");
    const largura = searchParams.get("largura");
    const profundidade = searchParams.get("profundidade");
    const ripas_por_prateleira = searchParams.get("ripas_por_prateleira");
    const espaco_entre_prateleiras = searchParams.get("espaco_entre_prateleiras");
    const bom = searchParams.get("bom");

    if (altura) setHeight(parseInt(altura, 10));
    if (largura) setWidth(parseInt(largura, 10));
    if (profundidade) setDepth(parseInt(profundidade, 10));
    if (ripas_por_prateleira) setSlatsPerShelf(parseInt(ripas_por_prateleira, 10));
    if (espaco_entre_prateleiras) setSpacePerShelf(parseInt(espaco_entre_prateleiras, 10));
    if (bom) setShowBom(bom === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = {
      altura: height,
      largura: width,
      profundidade: depth,
      ripas_por_prateleira: slatsPerShelf,
      espaco_entre_prateleiras: spacePerShelf,
    };

    if (showBom) params.bom = "true";

    setSearchParams(params, { replace: true });
  }, [height, width, depth, slatsPerShelf, spacePerShelf, showBom, setSearchParams]);

  const price = useMemo(
    () =>
      calculateShelfBasePrice({ width, height, shelves, slatsPerShelf }) +
      calculateApoiosCentraisPrice({ width, height, depth, shelves }),
    [width, height, depth, shelves, slatsPerShelf]
  );

  return (
    <div className="h-screen lg:h-auto lg:min-h-screen bg-[var(--background)] flex flex-col overflow-hidden lg:overflow-visible transition-colors duration-300">
      {/* Header / Hero */}
      <header className="hidden lg:flex pt-10 pb-6 px-6 lg:px-20 items-center justify-between gap-6">
        <h1 className="min-w-0 text-4xl md:text-6xl font-black text-amber-900 dark:text-amber-400 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Estante Pinus Fortaleza
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
          className="p-1.5 rounded-lg text-amber-200 hover:text-amber-50 transition-colors"
          aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-8 lg:px-12 pb-0 lg:pb-12 overflow-hidden lg:overflow-visible">
        {/* Left: 3D Scene */}
        <div className="h-[40vh] shrink-0 lg:col-span-7 lg:sticky lg:top-8 lg:h-[80vh] bg-white dark:bg-stone-900 lg:rounded-3xl shadow-2xl lg:shadow-amber-900/10 dark:lg:shadow-black/30 overflow-hidden group lg:self-start transition-colors duration-300">
          <Shelf3D
            width={width}
            height={height}
            depth={depth}
            shelves={shelves}
            slatsPerShelf={slatsPerShelf}
            spacePerShelf={spacePerShelf}
            pernasLateral={pernasLateral}
          />
          <div className="absolute bottom-6 left-6 z-20 hidden lg:block">
            <div className="glass-card px-4 py-2 rounded-full text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest">
              Interação 3D Ativa
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex-1 overflow-y-auto lg:overflow-visible lg:col-span-5 px-4 md:px-6 lg:px-0 lg:mt-0 pt-4 lg:pt-0 relative">
          <div className="bg-white dark:bg-stone-900 lg:bg-white/40 lg:dark:bg-stone-900/40 lg:backdrop-blur-xl rounded-t-[40px] lg:rounded-3xl p-6 lg:p-8 shadow-2xl lg:shadow-none border-t lg:border border-amber-900/5 dark:border-stone-700/30 min-h-[50vh] transition-colors duration-300">
            <Controls
              width={width}
              height={height}
              depth={depth}
              shelves={shelves}
              slatsPerShelf={slatsPerShelf}
              spacePerShelf={spacePerShelf}
              pernasLateral={pernasLateral}
              showBom={showBom}
              setWidth={setWidth}
              setHeight={setHeight}
              setDepth={setDepth}
              setShelves={setShelves}
              setSlatsPerShelf={setSlatsPerShelf}
              setSpacePerShelf={setSpacePerShelf}
              setPernasLateral={setPernasLateral}
              minWidth={LARGURA_MINIMA}
              maxWidth={LARGURA_MAXIMA}
              maxHeight={ALTURA_MAXIMA}
              minDepth={PROFUNDIDADE_MINIMA}
              maxDepth={PROFUNDIDADE_MAXIMA}
              minShelves={PRATELEIRAS_MINIMO}
              minSlatsPerShelf={TIRAS_POR_PRATELEIRA_MINIMO}
              minSpacePerShelf={ESPACO_POR_PRATELEIRA_MINIMO}
              maxSpacePerShelf={ESPACO_POR_PRATELEIRA_MAXIMO}
              price={price}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
