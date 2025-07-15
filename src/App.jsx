import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Shelf3D from "./Shelf3D";
import Controls from "./Controls";

export const RIPA_LARGURA = 4;
export const RIPA_ALTURA = 2;

const ALTURA = 80;
const LARGURA = 50;
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

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 h-screen">
      <div className="col-span-3 md:col-span-5 m-5 flex items-center justify-center">
        <p className="text-[50px] md:text-[100px] dancing-script text-amber-600">
          Estante Pinus
        </p>
      </div>
      <div
        id="scene-wrapper"
        className="col-span-3 rounded-xl shadow-xl m-5 border border-gray-300 rounded-xl shadow-lg aspect-square"
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
      <div className="col-span-3 md:col-span-2 m-5">
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
          // minHeight={ALTURA_MINIMA}
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
