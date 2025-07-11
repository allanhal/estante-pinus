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

      boxMesh.position.set(offsetX, offsetY, offsetZ);

      sceneObject.scene.add(boxMesh);
    }

    function addBasePrateleira({ sceneObject, andar = 1, offsetX = 0 }) {
      const boxGeometry1 = new THREE.BoxGeometry(
        PROFUNDIDADE,
        RIPA_ALTURA,
        RIPA_LARGURA
      );
      const boxMesh1 = new THREE.Mesh(boxGeometry1, boxMaterial);
      boxMesh1.position.set(
        0,
        andar * -RIPA_ALTURA,
        LARGURA / 2 - RIPA_LARGURA / 2
      );
      sceneObject.scene.add(boxMesh1);

      const boxGeometry2 = new THREE.BoxGeometry(
        PROFUNDIDADE,
        RIPA_ALTURA,
        RIPA_LARGURA
      );
      const boxMesh2 = new THREE.Mesh(boxGeometry2, boxMaterial);
      boxMesh2.position.set(
        0,
        andar * -RIPA_ALTURA,
        -LARGURA / 2 + RIPA_LARGURA / 2
      );
      sceneObject.scene.add(boxMesh2);
    }

    function addPrateleira({ andar = 1 }) {
      
      // andar 1
      // add tiras prateleiras
      for (let i = 0; i < TIRAS_POR_PRATELEIRA; i++) {
        addTiraPrateleira({
          sceneObject,
          offsetX:
            -PROFUNDIDADE / 2 +
            RIPA_LARGURA / 2 +
            i * (ESPACO_ENTRE_TIRAS + RIPA_LARGURA),
        });
      }
      
      // andar 2
      // add tiras prateleiras
      for (let i = 0; i < TIRAS_POR_PRATELEIRA; i++) {
        addTiraPrateleira({
          sceneObject,
          offsetX:
            -PROFUNDIDADE / 2 +
            RIPA_LARGURA / 2 +
            i * (ESPACO_ENTRE_TIRAS + RIPA_LARGURA),
          offsetY: 10,
        });
      }

      // andar 3
      // add tiras prateleiras
      for (let i = 0; i < TIRAS_POR_PRATELEIRA; i++) {
        addTiraPrateleira({
          sceneObject,
          offsetX:
            -PROFUNDIDADE / 2 +
            RIPA_LARGURA / 2 +
            i * (ESPACO_ENTRE_TIRAS + RIPA_LARGURA),
          offsetY: 20,
        });
      }

      addBasePrateleira({
        sceneObject,
      });
    }

    const sceneObject = new SceneInit("myThreeJsCanvas");
    sceneObject.initialize();
    sceneObject.animate();

    addPrateleira({ andar: 1 });

    // addPrateleira({ andar: 2 });

    // sceneObject.camera.position.set(100, 100, 100); // posição diagonal de cima
    // sceneObject.camera.position.set(0, 0, 100); // posição lateral
    sceneObject.camera.position.set(100, 50, -100); // posição diagonal de cima
    sceneObject.camera.lookAt(0, 0, 0); // olhando para o centro da cena
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
