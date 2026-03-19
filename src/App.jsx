import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Shelf3D from "./Shelf3D";
import Controls from "./Controls";

export const FRETE_FIXO_CAMINHAO = 70;
export const FRETE_FIXO_CARRO = 40;
export const FRETE_FIXO_MOTO = 20;
export const CUSTO_FIXO_MONTAGEM_ESTANTE = 10;

export const RIPA_LARGURA = 4;
export const RIPA_ALTURA = 2;

const ALTURA = 60;
const LARGURA = 40;
const PROFUNDIDADE = 30;
const PRATELEIRAS = 4;
const TIRAS_POR_PRATELEIRA = 4;

const LARGURA_MINIMA = 30;
const LARGURA_MAXIMA = 90;

const ALTURA_MAXIMA = 250;

const PROFUNDIDADE_MINIMA = 20;
const PROFUNDIDADE_MAXIMA = 50;

const PRATELEIRAS_MINIMO = 2;

const TIRAS_POR_PRATELEIRA_MINIMO = 3;

const DISTANCIA_ENTRE_PRATELEIRAS = 20; // Distância entre as prateleiras
const ESPACO_POR_PRATELEIRA_MINIMO = 10;
const ESPACO_POR_PRATELEIRA_MAXIMO = 50;

function App() {
  const [width, setWidth] = useState(LARGURA);
  const [height, setHeight] = useState(ALTURA);
  const [depth, setDepth] = useState(PROFUNDIDADE);
  const [shelves, setShelves] = useState(PRATELEIRAS);
  const [slatsPerShelf, setSlatsPerShelf] = useState(TIRAS_POR_PRATELEIRA);
  const [spacePerShelf, setSpacePerShelf] = useState(DISTANCIA_ENTRE_PRATELEIRAS);
  const [price, setPrice] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const altura = searchParams.get("altura");
    const largura = searchParams.get("largura");
    const profundidade = searchParams.get("profundidade");
    const ripas_por_prateleira = searchParams.get("ripas_por_prateleira");
    const espaco_entre_prateleiras = searchParams.get("espaco_entre_prateleiras");

    if (altura) setHeight(parseInt(altura, 10));
    if (largura) setWidth(parseInt(largura, 10));
    if (profundidade) setDepth(parseInt(profundidade, 10));
    if (ripas_por_prateleira) setSlatsPerShelf(parseInt(ripas_por_prateleira, 10));
    if (espaco_entre_prateleiras) setSpacePerShelf(parseInt(espaco_entre_prateleiras, 10));
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen lg:h-auto lg:min-h-screen bg-[#fdfbf7] flex flex-col overflow-hidden lg:overflow-visible">
      {/* Header / Hero */}
      <header className="hidden lg:block pt-10 pb-6 px-6 text-center lg:text-left lg:px-20">
        <h1 className="text-4xl md:text-6xl font-black text-amber-900 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Estante Pinus Fortaleza
        </h1>
      </header>

      <div className="lg:hidden bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-4 py-2.5 text-center shrink-0 shadow-md">
        <span className="text-amber-50 tracking-wide font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Estante Pinus Fortaleza</span>
      </div>

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-8 lg:px-12 pb-0 lg:pb-12 overflow-hidden lg:overflow-visible">
        {/* Left: 3D Scene */}
        <div className="h-[40vh] shrink-0 lg:col-span-7 lg:sticky lg:top-8 lg:h-[80vh] bg-white lg:rounded-3xl shadow-2xl lg:shadow-amber-900/10 overflow-hidden group lg:self-start">
          <Shelf3D
            width={width}
            height={height}
            depth={depth}
            shelves={shelves}
            slatsPerShelf={slatsPerShelf}
            spacePerShelf={spacePerShelf}
            setPrice={setPrice}
          />
          <div className="absolute bottom-6 left-6 z-20 hidden lg:block">
            <div className="glass-card px-4 py-2 rounded-full text-xs font-bold text-amber-900 uppercase tracking-widest">
              Interação 3D Ativa
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex-1 overflow-y-auto lg:overflow-visible lg:col-span-5 px-4 md:px-6 lg:px-0 lg:mt-0 pt-4 lg:pt-0 relative">
          <div className="bg-white lg:bg-white/40 lg:backdrop-blur-xl rounded-t-[40px] lg:rounded-3xl p-6 lg:p-8 shadow-2xl lg:shadow-none border-t lg:border border-amber-900/5 min-h-[50vh]">
            <Controls
              width={width}
              height={height}
              depth={depth}
              shelves={shelves}
              slatsPerShelf={slatsPerShelf}
              spacePerShelf={spacePerShelf}
              setWidth={setWidth}
              setHeight={setHeight}
              setDepth={setDepth}
              setShelves={setShelves}
              setSlatsPerShelf={setSlatsPerShelf}
              setSpacePerShelf={setSpacePerShelf}
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
