import { useEffect } from "react";
import * as THREE from "three";
import SceneInit from "./lib/SceneInit";
import Shelf3D from "./Shelf3D";

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

  return (
    <div>
      <Shelf3D />
    </div>
  );
}

export default App;
