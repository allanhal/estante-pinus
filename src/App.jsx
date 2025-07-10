import { useEffect } from "react";

import * as THREE from "three";

import SceneInit from "./lib/SceneInit";

function App() {
  useEffect(() => {
    function addBox(test) {
      const boxGeometry = new THREE.BoxGeometry(2, 4, 50);
      // const boxMaterial = new THREE.MeshNormalMaterial();
      const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // SaddleBrown

      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      test.scene.add(boxMesh);
    }

    function addSphere(test) {
      // Criar geometria da esfera
      const sphereGeometry = new THREE.SphereGeometry(2, 32, 32); // raio 2, segmentos
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
      }); // Vermelha
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Posicionar a esfera para não ficar dentro da caixa
      sphereMesh.position.set(5, 0, 0); // x=5, y=0, z=0

      // Adicionar à cena
      test.scene.add(sphereMesh);
    }

    const test = new SceneInit("myThreeJsCanvas");
    test.initialize();
    test.animate();

    addBox(test);

    addSphere(test);

    test.camera.position.set(50, 50, 50); // posição diagonal de cima
    test.camera.lookAt(0, 0, 0); // olhando para o centro da cena
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
