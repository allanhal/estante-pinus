import { useEffect, useState, useRef } from "react";
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
  const sceneRef = useRef(null);
  const [arrayOfTiras, setArrayOfTiras] = useState([]);

  useEffect(() => {
    // Total meters calculation for pricing
    const totalMeters = arrayOfTiras.reduce((total, num) => total + num, 0);
    setPrice(Math.round(totalMeters / 300) * 10 + 10);
  }, [arrayOfTiras, setPrice]);

  useEffect(() => {
    if (!sceneRef.current) {
      sceneRef.current = new SceneInit("myThreeJsCanvas");
      sceneRef.current.initialize();
      sceneRef.current.animate();
      
      // Improve lighting for premium look
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      sceneRef.current.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(500, 500, 500);
      directionalLight.castShadow = true;
      sceneRef.current.scene.add(directionalLight);

      const softLight = new THREE.PointLight(0xfff3c7, 0.4);
      softLight.position.set(-200, 300, 0);
      sceneRef.current.scene.add(softLight);
    }

    const sceneObject = sceneRef.current;
    
    // Clear existing meshes
    while(sceneObject.scene.children.length > 0){ 
        sceneObject.scene.remove(sceneObject.scene.children[0]); 
    }

    // Restore lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneObject.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    sceneObject.scene.add(directionalLight);

    const newArrayOfTiras = [];
    
    // Premium Wood Material
    const boxMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x92400e, 
      roughness: 0.6, 
      metalness: 0.1 
    });

    function addTiraPrateleira({
      boxGeometry,
      offsetX = 0,
      offsetY = 0,
      offsetZ = 0,
    }) {
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh.position.set(offsetX, offsetY, offsetZ);
      sceneObject.scene.add(boxMesh);
    }

    function addBasePrateleira({ andar = 1 }) {
      const boxGeometry = new THREE.BoxGeometry(
        depth,
        RIPA_ALTURA,
        RIPA_LARGURA
      );
      
      const boxMesh1 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh1.position.set(
        0,
        -RIPA_ALTURA + andar * spacePerShelf,
        width / 2 - RIPA_LARGURA / 2 - RIPA_LARGURA / 2
      );
      sceneObject.scene.add(boxMesh1);

      const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh2.position.set(
        0,
        -RIPA_ALTURA + andar * spacePerShelf,
        -width / 2 + RIPA_LARGURA / 2 + RIPA_LARGURA / 2
      );
      sceneObject.scene.add(boxMesh2);
    }

    function addPes() {
      newArrayOfTiras.push(height, height, height, height);
      const boxGeometry = new THREE.BoxGeometry(
        RIPA_LARGURA,
        height,
        RIPA_ALTURA
      );

      const positions = [
        [-depth / 2 + RIPA_LARGURA / 2, height / 2 - spacePerShelf, width / 2 - RIPA_ALTURA / 2],
        [-depth / 2 + RIPA_LARGURA / 2, height / 2 - spacePerShelf, -width / 2 + RIPA_ALTURA / 2],
        [depth / 2 - RIPA_LARGURA / 2, height / 2 - spacePerShelf, -width / 2 + RIPA_ALTURA / 2],
        [depth / 2 - RIPA_LARGURA / 2, height / 2 - spacePerShelf, width / 2 - RIPA_ALTURA / 2],
      ];

      positions.forEach(pos => {
        const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        mesh.position.set(...pos);
        sceneObject.scene.add(mesh);
      });
    }

    function addPrateleiras() {
      const boxGeometry = new THREE.BoxGeometry(
        RIPA_LARGURA,
        RIPA_ALTURA,
        width - RIPA_LARGURA
      );

      const gap = (depth - slatsPerShelf * RIPA_LARGURA) / (slatsPerShelf - 1);

      for (let i = 0; i < shelves; i++) {
        for (let j = 0; j < slatsPerShelf; j++) {
          newArrayOfTiras.push(width - RIPA_LARGURA);
          addTiraPrateleira({
            boxGeometry,
            offsetX: -depth / 2 + RIPA_LARGURA / 2 + j * (gap + RIPA_LARGURA),
            offsetY: i * spacePerShelf,
          });
        }
        addBasePrateleira({ andar: i });
      }
    }

    addPrateleiras();
    addPes();

    // Compute bounding box of all shelf meshes to find true center
    const box = new THREE.Box3();
    sceneObject.scene.children.forEach(child => {
      if (child.isMesh) box.expandByObject(child);
    });
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const dist = Math.max(size.x, size.y, size.z) * 2.5;

    sceneObject.camera.position.set(center.x + dist, center.y + dist * 0.7, center.z + dist);
    sceneObject.camera.lookAt(center.x, center.y, center.z);
    sceneObject.controls.target.set(center.x, center.y, center.z);
    sceneObject.controls.update();

    setArrayOfTiras(newArrayOfTiras);

    // Export Handler
    const exportBtn = document.getElementById("button");
    const handleExport = () => {
      const exporter = new STLExporter();
      const stlString = exporter.parse(sceneObject.scene);
      const blob = new Blob([stlString], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "estante-pinus.stl";
      link.click();
    };
    
    exportBtn?.addEventListener("click", handleExport);
    return () => exportBtn?.removeEventListener("click", handleExport);
  }, [width, height, depth, shelves, slatsPerShelf, spacePerShelf]);

  return (
    <div className="w-full h-full relative">
      <canvas id="myThreeJsCanvas" className="w-full h-full block" />
    </div>
  );
}

export default Shelf3D;
