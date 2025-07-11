import { useEffect } from "react";
import * as THREE from "three";
import SceneInit from "./lib/SceneInit";

const RIPA_LARGURA = 4;
const RIPA_ALTURA = 2;

const ALTURA = 80;
const LARGURA = 60;
const PROFUNDIDADE = 30;
const PRATELEIRAS = 4;
const TIRAS_POR_PRATELEIRA = 4;

const MIN_TIRAS = 2;
const MAX_TIRAS = Math.floor(PROFUNDIDADE / RIPA_LARGURA);

const ESPACO_ENTRE_TIRAS =
  (PROFUNDIDADE - TIRAS_POR_PRATELEIRA * RIPA_LARGURA) /
  (TIRAS_POR_PRATELEIRA - 1);

function App() {
  useEffect(() => {
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // SaddleBrown
    function addTiraPrateleira({
      sceneObject,
      offsetX = 0,
      offsetY = 0,
      offsetZ = 0,
    }) {
      const boxGeometry = new THREE.BoxGeometry(
        RIPA_LARGURA,
        RIPA_ALTURA,
        LARGURA
      );
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      boxMesh.position.set(offsetX, offsetY, offsetZ); // x=5, y=0, z=0

      sceneObject.scene.add(boxMesh);
    }
    function addBasePrateleira({
      sceneObject,
      andar = 1,
      aaa = 13
    }) {
      const boxGeometry1 = new THREE.BoxGeometry(
        PROFUNDIDADE,
        RIPA_ALTURA,
        RIPA_LARGURA // largura, altura, profundidade
      );
      const boxMesh1 = new THREE.Mesh(boxGeometry1, boxMaterial);
      boxMesh1.position.set(aaa, andar*(-RIPA_ALTURA), PROFUNDIDADE - RIPA_LARGURA / 2); // x=5, y=0, z=0
      sceneObject.scene.add(boxMesh1);

      const boxGeometry2 = new THREE.BoxGeometry(
        PROFUNDIDADE,
        RIPA_ALTURA,
        RIPA_LARGURA // largura, altura, profundidade
      );
      const boxMesh2 = new THREE.Mesh(boxGeometry2, boxMaterial);
      boxMesh2.position.set(aaa, andar*(-RIPA_ALTURA), -PROFUNDIDADE + (RIPA_LARGURA / 2)); // x=5, y=0, z=0
      sceneObject.scene.add(boxMesh2);
    }

    function addPrateleira() {
      // add tiras prateleiras
      for (let i = 0; i < TIRAS_POR_PRATELEIRA; i++) {
        addTiraPrateleira({
          sceneObject,
          offsetX: i * (ESPACO_ENTRE_TIRAS + RIPA_LARGURA),
        });
      }

      addBasePrateleira({
        sceneObject,
      });
    }

    const sceneObject = new SceneInit("myThreeJsCanvas");
    sceneObject.initialize();
    sceneObject.animate();

    addPrateleira();

    sceneObject.camera.position.set(100, 100, 100); // posição diagonal de cima
    sceneObject.camera.lookAt(0, 0, 0); // olhando para o centro da cena
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
