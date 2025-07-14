import { useEffect, useState } from "react";
// import * as THREE from "three";
// import SceneInit from "./lib/SceneInit";
import Shelf3D from "./Shelf3D";
import Controls from "./Controls";

export const RIPA_LARGURA = 4;
export const RIPA_ALTURA = 2;

const LARGURA = 80;
const ALTURA = 80;
const PROFUNDIDADE = 50;
const PRATELEIRAS = 4;
const TIRAS_POR_PRATELEIRA = 7;

const LARGURA_MINIMA = 30;
const LARGURA_MAXIMA = 90;

const ALTURA_MINIMA = 40;
const ALTURA_MAXIMA = 250;

const PROFUNDIDADE_MINIMA = 20;
const PROFUNDIDADE_MAXIMA = 50;

const PRATELEIRAS_MINIMO = 2;

const TIRAS_POR_PRATELEIRA_MINIMO = 3;

const DISTANCIA_ENTRE_PRATELEIRAS = 10; // Distância entre as prateleiras
const ESPACO_POR_PRATELEIRA_MINIMO = 10;
const ESPACO_POR_PRATELEIRA_MAXIMO = 30;

function App() {
  const [width, setWidth] = useState(LARGURA);
  const [height, setHeight] = useState(ALTURA);
  const [depth, setDepth] = useState(PROFUNDIDADE);
  const [shelves, setShelves] = useState(PRATELEIRAS);
  const [slatsPerShelf, setSlatsPerShelf] = useState(TIRAS_POR_PRATELEIRA);
  const [spacePerShelf, setSpacePerShelf] = useState(DISTANCIA_ENTRE_PRATELEIRAS);

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-4 m-5 flex items-center justify-center border border-gray-300 rounded-xl shadow-lg">
        <p className="text-[100px] font-tiktok">Estante Pinus</p>
      </div>
      <div
        id="scene-wrapper"
        className="col-span-3 rounded-xl shadow-xl m-5 border border-gray-300 rounded-xl shadow-lg"
      >
        <Shelf3D
          width={width}
          height={height}
          depth={depth}
          shelves={shelves}
          slatsPerShelf={slatsPerShelf}
          spacePerShelf={spacePerShelf}
        />
      </div>
      <div className="m-5 ">
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
          minHeight={ALTURA_MINIMA}
          maxHeight={ALTURA_MAXIMA}
          minDepth={PROFUNDIDADE_MINIMA}
          maxDepth={PROFUNDIDADE_MAXIMA}
          minShelves={PRATELEIRAS_MINIMO}
          minSlatsPerShelf={TIRAS_POR_PRATELEIRA_MINIMO}
          minSpacePerShelf={ESPACO_POR_PRATELEIRA_MINIMO}
          maxSpacePerShelf={ESPACO_POR_PRATELEIRA_MINIMO}
        />
      </div>
    </div>
  );
}

export default App;
