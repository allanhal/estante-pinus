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
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x1a0a03 });

    function addMeshWithEdges(geometry, position) {
      const mesh = new THREE.Mesh(geometry, boxMaterial);
      mesh.position.set(...position);
      sceneObject.scene.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, edgeMaterial);
      line.position.set(...position);
      sceneObject.scene.add(line);
    }

    function addTiraPrateleira({
      boxGeometry,
      offsetX = 0,
      offsetY = 0,
      offsetZ = 0,
    }) {
      addMeshWithEdges(boxGeometry, [offsetX, offsetY, offsetZ]);
    }

    function addBasePrateleira({ andar = 1 }) {
      const boxGeometry = new THREE.BoxGeometry(
        depth,
        RIPA_ALTURA,
        RIPA_LARGURA
      );
      
      addMeshWithEdges(boxGeometry, [0, -RIPA_ALTURA + andar * spacePerShelf, width / 2 - RIPA_LARGURA / 2 - RIPA_LARGURA / 2]);
      addMeshWithEdges(boxGeometry, [0, -RIPA_ALTURA + andar * spacePerShelf, -width / 2 + RIPA_LARGURA / 2 + RIPA_LARGURA / 2]);
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

      positions.forEach(pos => addMeshWithEdges(boxGeometry, pos));
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

    // Compute bounding box from shelf meshes BEFORE adding dimension lines
    const box = new THREE.Box3();
    sceneObject.scene.children.forEach(child => {
      if (child.isMesh) box.expandByObject(child);
    });
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Account for dimension lines extending beyond the shelf
    const maxDim = Math.max(size.x, size.y, size.z);
    const dimOffset = 8 * (maxDim / 60); // same as offset used for dimension lines
    const totalHeight = size.y + dimOffset * 2 + 10; // extra for ticks + labels below
    const totalWidth = (size.x + size.z) * 0.7 + dimOffset * 2 + 10;

    // Calculate distance to fit the object tightly in the viewport
    const fovRad = sceneObject.camera.fov * (Math.PI / 180);
    const aspect = sceneObject.camera.aspect;

    // Distance needed to fit height vs width
    const distForHeight = totalHeight / (2 * Math.tan(fovRad / 2));
    const distForWidth = totalWidth / (2 * Math.tan(fovRad / 2) * aspect);
    const fitDist = Math.max(distForHeight, distForWidth) * 1.15;

    // Position camera diagonally
    const camDir = new THREE.Vector3(1, 0.4, 1).normalize();
    sceneObject.camera.position.set(
      center.x + camDir.x * fitDist,
      center.y + camDir.y * fitDist,
      center.z + camDir.z * fitDist
    );
    sceneObject.camera.lookAt(center.x, center.y, center.z);
    sceneObject.controls.target.set(center.x, center.y, center.z);
    sceneObject.controls.update();

    // --- Dimension lines and labels ---
    const dimColor = 0x444444;
    const dimMaterial = new THREE.MeshBasicMaterial({ color: dimColor });
    const scaleFactor = maxDim / 60; // scale relative to default shelf size
    const offset = 8 * scaleFactor;
    const lineRadius = 0.3 * scaleFactor;

    function createTextSprite(text) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 256;
      canvas.height = 64;
      ctx.fillStyle = "#1e293b";
      ctx.roundRect(0, 0, 256, 64, 10);
      ctx.fill();
      ctx.font = "bold 36px Outfit, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 128, 32);
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(material);
      const spriteScale = 16 * scaleFactor;
      sprite.scale.set(spriteScale, spriteScale * 0.25, 1);
      return sprite;
    }

    function addRod(start, end) {
      const s = new THREE.Vector3(...start);
      const e = new THREE.Vector3(...end);
      const dir = new THREE.Vector3().subVectors(e, s);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
      const cyl = new THREE.CylinderGeometry(lineRadius, lineRadius, len, 6);
      const mesh = new THREE.Mesh(cyl, dimMaterial);
      mesh.position.copy(mid);
      // Align cylinder to direction
      const axis = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(axis, dir.normalize());
      mesh.quaternion.copy(quat);
      sceneObject.scene.add(mesh);
    }

    function addDimensionLine(start, end, label) {
      // Main line as cylinder
      addRod(start, end);

      // End caps (small perpendicular ticks)
      const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start)).normalize();
      const tickSize = 3 * scaleFactor;
      const up = new THREE.Vector3(0, 1, 0);
      let perp = new THREE.Vector3().crossVectors(dir, up).normalize();
      if (perp.length() < 0.1) {
        perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(1, 0, 0)).normalize();
      }

      for (const pt of [new THREE.Vector3(...start), new THREE.Vector3(...end)]) {
        const t1 = pt.clone().add(perp.clone().multiplyScalar(tickSize));
        const t2 = pt.clone().add(perp.clone().multiplyScalar(-tickSize));
        addRod([t1.x, t1.y, t1.z], [t2.x, t2.y, t2.z]);
      }

      // Text label at midpoint
      const mid = new THREE.Vector3(...start).add(new THREE.Vector3(...end)).multiplyScalar(0.5);
      const sprite = createTextSprite(label);
      sprite.position.copy(mid);
      sceneObject.scene.add(sprite);
    }

    // Shelf bounds
    const legBottom = -spacePerShelf;
    const legTop = height - spacePerShelf;
    const frontX = depth / 2;
    const rightZ = width / 2;
    const leftZ = -width / 2;
    const backX = -depth / 2;

    // Height line (right side, front)
    addDimensionLine(
      [frontX + offset, legBottom, rightZ + offset],
      [frontX + offset, legTop, rightZ + offset],
      `${height} cm`
    );

    // Width line (front bottom)
    addDimensionLine(
      [frontX + offset, legBottom - offset, leftZ],
      [frontX + offset, legBottom - offset, rightZ],
      `${width} cm`
    );

    // Depth line (right side bottom)
    addDimensionLine(
      [backX, legBottom - offset, rightZ + offset],
      [frontX, legBottom - offset, rightZ + offset],
      `${depth} cm`
    );

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
