import { useEffect, useState } from "react";
import * as THREE from "three";
import SceneInit from "./lib/SceneInit";
import Shelf3D from "./Shelf3D";
import Controls from "./Controls";

const RIPA_LARGURA = 4;
const RIPA_ALTURA = 2;

const ALTURA = 80;
const LARGURA = 70;
const PROFUNDIDADE = 50;
const PRATELEIRAS = 3;
const TIRAS_POR_PRATELEIRA = 6;

const MIN_TIRAS = 2;
const MAX_TIRAS = Math.floor(PROFUNDIDADE / RIPA_LARGURA);

const ESPACO_ENTRE_TIRAS =
  (PROFUNDIDADE - TIRAS_POR_PRATELEIRA * RIPA_LARGURA) /
  (TIRAS_POR_PRATELEIRA - 1);

const DISTANCIA_ENTRE_PRATELEIRAS = 20; // Distância entre as prateleiras

function App() {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(250);
  const [depth, setDepth] = useState(120);
  const [shelves, setShelves] = useState(4);
  const [slatsPerShelf, setSlatsPerShelf] = useState(6);

  return (
    <div className="grid grid-cols-4 h-screen">
      <div className="col-span-4 m-5 flex items-center justify-center border border-gray-300 rounded-xl shadow-lg">
        <p className="text-[100px] font-tiktok">Estante Pinus</p>
        {/* <p class="text-2xl">Estante Pinus</p> */}
      </div>
      <div
        id="scene-wrapper"
        // className="col-span-3 bg-blue-500 border border-black m-5"
        className="col-span-3 rounded-xl shadow-xl m-5 border border-gray-300 rounded-xl shadow-lg"
      >
        <Shelf3D />
      </div>
      <div
        // className="bg-cyan-500 border border-black m-5"
        className="m-5 "
        // className="bg-white rounded-xl shadow-lg m-5 space-y-6"
      >
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
  // return (
  //   <div className="static">
  //     <Shelf3D />
  //     <div className="absolute top-5 right-0 w-64">
  // <Controls
  //   width={width}
  //   height={height}
  //   depth={depth}
  //   shelves={shelves}
  //   slatsPerShelf={slatsPerShelf}
  //   setWidth={setWidth}
  //   setHeight={setHeight}
  //   setDepth={setDepth}
  //   setShelves={setShelves}
  //   setSlatsPerShelf={setSlatsPerShelf}
  // />
  //     </div>
  //   </div>
  // );
}

export default App;
