import { useEffect, useState } from "react";
import * as THREE from "three";
import SceneInit from "./lib/SceneInit";
import { RIPA_ALTURA, RIPA_LARGURA } from "./App";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";

function Shelf3D({
  width = 70,
  height = 80,
  depth = 50,
  shelves = 3,
  slatsPerShelf = 6,
  spacePerShelf,
  setPrice,
}) {
  let ALTURA = height;
  let LARGURA = width;
  let PROFUNDIDADE = depth;
  let PRATELEIRAS = shelves;
  let TIRAS_POR_PRATELEIRA = slatsPerShelf;

  const [arrayOfTiras, setArrayOfTiras] = useState([]);

  useEffect(() => {
    setPrice(
      Math.round(arrayOfTiras.reduce((total, num) => total + num, 0) / 300) *
        10 +
        10
    );
  }, [arrayOfTiras]);

  useEffect(() => {
    setArrayOfTiras([]);
    const newArrayOfTiras = [];
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // SaddleBrown
    function addTiraPrateleira({
      sceneObject,
      boxGeometry,
      offsetX = 0,
      offsetY = 0,
      offsetZ = 0,
    }) {
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      boxMesh.position.set(offsetX, offsetY, offsetZ);

      sceneObject.scene.add(boxMesh);
    }

    function addBasePrateleira({ sceneObject, andar = 1, offsetX = 0 }) {
      const boxGeometry = new THREE.BoxGeometry(
        PROFUNDIDADE,
        RIPA_ALTURA,
        RIPA_LARGURA
      );
      const boxMesh1 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh1.position.set(
        0,
        -RIPA_ALTURA + andar * spacePerShelf,
        LARGURA / 2 - RIPA_LARGURA / 2 - RIPA_LARGURA / 2
      );
      sceneObject.scene.add(boxMesh1);

      const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh2.position.set(
        0,
        -RIPA_ALTURA + andar * spacePerShelf,
        -LARGURA / 2 + RIPA_LARGURA / 2 + RIPA_LARGURA / 2
      );
      sceneObject.scene.add(boxMesh2);
    }

    function addPes({ sceneObject }) {
      newArrayOfTiras.push(ALTURA);
      newArrayOfTiras.push(ALTURA);
      newArrayOfTiras.push(ALTURA);
      newArrayOfTiras.push(ALTURA);
      const boxGeometry = new THREE.BoxGeometry(
        RIPA_LARGURA,
        ALTURA,
        RIPA_ALTURA
      );

      const boxMesh1 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh1.position.set(
        -PROFUNDIDADE / 2 + RIPA_LARGURA / 2,
        ALTURA / 2 - spacePerShelf,
        LARGURA / 2 - RIPA_ALTURA / 2
      );
      sceneObject.scene.add(boxMesh1);

      const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh2.position.set(
        -PROFUNDIDADE / 2 + RIPA_LARGURA / 2,
        ALTURA / 2 - spacePerShelf,
        -LARGURA / 2 + RIPA_ALTURA / 2
      );
      sceneObject.scene.add(boxMesh2);

      const boxMesh3 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh3.position.set(
        +PROFUNDIDADE / 2 - RIPA_LARGURA / 2,
        ALTURA / 2 - spacePerShelf,
        -LARGURA / 2 + RIPA_ALTURA / 2
      );
      sceneObject.scene.add(boxMesh3);

      const boxMesh4 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh4.position.set(
        +PROFUNDIDADE / 2 - RIPA_LARGURA / 2,
        ALTURA / 2 - spacePerShelf,
        +LARGURA / 2 - RIPA_ALTURA / 2
      );
      sceneObject.scene.add(boxMesh4);
    }

    function addPrateleira() {
      const boxGeometry = new THREE.BoxGeometry(
        RIPA_LARGURA,
        RIPA_ALTURA,
        LARGURA - RIPA_LARGURA
      );

      const ESPACO_ENTRE_TIRAS =
        (PROFUNDIDADE - TIRAS_POR_PRATELEIRA * RIPA_LARGURA) /
        (TIRAS_POR_PRATELEIRA - 1);

      for (let andarIndex = 0; andarIndex < PRATELEIRAS; andarIndex++) {
        // Tiras da prateleira
        for (let i = 0; i < TIRAS_POR_PRATELEIRA; i++) {
          newArrayOfTiras.push(LARGURA - RIPA_LARGURA);
          addTiraPrateleira({
            sceneObject,
            boxGeometry,
            offsetX:
              -PROFUNDIDADE / 2 +
              RIPA_LARGURA / 2 +
              i * (ESPACO_ENTRE_TIRAS + RIPA_LARGURA),
            offsetY: andarIndex * spacePerShelf,
          });
        }

        // Base das tiras da prateleira
        addBasePrateleira({
          sceneObject,
          andar: andarIndex,
        });
      }
    }

    const sceneObject = new SceneInit("myThreeJsCanvas");
    sceneObject.initialize();
    sceneObject.animate();

    addPrateleira();

    addPes({
      sceneObject,
    });

    // sceneObject.camera.position.set(500, 500, 500); // posição diagonal de cima
    // sceneObject.camera.position.set(400, 400, 400); // posição diagonal de cima
    // sceneObject.camera.position.set(200, 200, 200); // posição diagonal de cima
    // sceneObject.camera.position.set(120, 120, 120); // posição diagonal de cima
    // sceneObject.camera.position.set(40, 40, 40); // posição diagonal de cima
    // sceneObject.camera.position.set(10, 10, 10); // posição diagonal de cima
    // sceneObject.camera.position.set(100, 60, 0); // posição diagonal de cima
    // sceneObject.camera.position.set(20 + height * 2, 20 + height * 2, height);
    sceneObject.camera.position.set(
      20 + height * 5,
      20 + height * 3,
      20 + height * 3
    );
    // sceneObject.camera.position.set(0, 0, 100); // posição lateral
    // sceneObject.camera.position.set(-100, 0, 20); // posição lateral
    // sceneObject.camera.position.set(100, 50, -100); // posição diagonal de cima
    sceneObject.camera.lookAt(0, 0, 0); // olhando para o centro da cena

    setArrayOfTiras(newArrayOfTiras);

    document.getElementById("button").addEventListener("click", () => {
      const exporter = new STLExporter();
      const stlString = exporter.parse(sceneObject.scene);
      const blob = new Blob([stlString], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "estante.stl";
      link.click();
    });
  }, [width, height, depth, shelves, slatsPerShelf, spacePerShelf]);

  return (
    <div>
      <canvas id="myThreeJsCanvas" className="p-2" />
    </div>
  );
}

export default Shelf3D;
