import { useEffect, useState } from "react";
// import * as THREE from "three";
// import SceneInit from "./lib/SceneInit";
import Shelf3D from "./Shelf3D";
import Controls from "./Controls";

export const RIPA_LARGURA = 4;
export const RIPA_ALTURA = 2;

const LARGURA = 80;
const ALTURA = 165;
const PROFUNDIDADE = 50;
const PRATELEIRAS = 6;
const TIRAS_POR_PRATELEIRA = 7;

export const MIN_TIRAS = 2;
export const MAX_TIRAS = Math.floor(PROFUNDIDADE / RIPA_LARGURA);

// export const ESPACO_ENTRE_TIRAS =
//   (PROFUNDIDADE - TIRAS_POR_PRATELEIRA * RIPA_LARGURA) /
//   (TIRAS_POR_PRATELEIRA - 1);

export const DISTANCIA_ENTRE_PRATELEIRAS = 20; // Distância entre as prateleiras

function App() {
  const [width, setWidth] = useState(LARGURA);
  const [height, setHeight] = useState(ALTURA);
  const [depth, setDepth] = useState(PROFUNDIDADE);
  const [shelves, setShelves] = useState(PRATELEIRAS);
  const [slatsPerShelf, setSlatsPerShelf] = useState(TIRAS_POR_PRATELEIRA);

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
        />
      </div>
      <div className="m-5 ">
        <Controls
          width={width}
          height={height}
          depth={depth}
          shelves={shelves}
          slatsPerShelf={slatsPerShelf}
          setWidth={setWidth}
          setHeight={setHeight}
          setDepth={setDepth}
          setShelves={setShelves}
          setSlatsPerShelf={setSlatsPerShelf}
        />
      </div>
    </div>
  );
}

export default App;
