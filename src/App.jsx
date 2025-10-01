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
  const [spacePerShelf, setSpacePerShelf] = useState(
    DISTANCIA_ENTRE_PRATELEIRAS
  );
  const [price, setPrice] = useState();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [searchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const entries = Object.fromEntries(searchParams.entries());
    setQueryParams(entries);
  }, [searchParams]);

  useEffect(() => {
    const {
      altura,
      largura,
      profundidade,
      ripas_por_prateleira,
      espaco_entre_prateleiras,
    } = queryParams;

    // http://localhost:3000/?altura=80&largura=80&profundidade=30&ripas_por_prateleira=7&espaco_entre_prateleiras=20&name=allan&age=36

    if (altura === undefined) {
      setHeight(ALTURA);
    } else {
      setHeight(parseInt(altura, 10));
    }
    if (largura === undefined) {
      setWidth(LARGURA);
    } else {
      setWidth(parseInt(largura, 10));
    }
    if (profundidade === undefined) {
      setDepth(PROFUNDIDADE);
    } else {
      setDepth(parseInt(profundidade, 10));
    }
    if (ripas_por_prateleira === undefined) {
      setSlatsPerShelf(TIRAS_POR_PRATELEIRA);
    } else {
      setSlatsPerShelf(parseInt(ripas_por_prateleira, 10));
    }
    if (espaco_entre_prateleiras === undefined) {
      setSpacePerShelf(DISTANCIA_ENTRE_PRATELEIRAS);
    } else {
      setSpacePerShelf(parseInt(espaco_entre_prateleiras, 10));
    }
  }, [queryParams]);

  // Não sei se isso é uma boa solução, talvez criar um hook para isso
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen gap-4 p-4">
      <div className="col-span-2 flex flex-col items-center justify-center mb-5">
        <p
          className="text-[30px] sm:text-[60px] md:text-[80px] font-serif text-amber-600 drop-shadow-lg"
          style={{ fontFamily: "Bungee Outline, cursive", fontWeight: "bold" }}
        >
          Pinus & Forma
        </p>
        <p className="text-lg md:text-xl text-amber-600 text-center">
          Personalize sua estante em madeira de pinus com simplicidade e estilo,
          do seu jeito.
        </p>
      </div>

      <div
        id="scene-wrapper"
        className={
          isMobile
            ? "block md:hidden col-span-3 rounded-xl shadow-xl m-5 border border-gray-300 rounded-xl shadow-lg aspect-square mb-6"
            : "col-span-1 md:col-span-1 rounded-3xl shadow-xl border border-gray-200 m-1 mb-6"
        }
      >
        <Shelf3D
          width={width}
          height={height}
          depth={depth}
          shelves={shelves}
          slatsPerShelf={slatsPerShelf}
          spacePerShelf={spacePerShelf}
          setPrice={setPrice}
        />
      </div>

      <div
        className={
          isMobile
            ? "col-span-3 md:col-span-2 m-5 pb-6"
            : "col-span-1 md:col-span-1 m-1 pb-6"
        }
      >
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
  );
}

export default App;
