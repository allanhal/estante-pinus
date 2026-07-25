import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import SceneInit from "./lib/SceneInit";
import { RIPA_ALTURA, RIPA_LARGURA } from "./App";
import { ESPESSURA, LARGURA_PECA, getSupportRun } from "./ripa";

const WOOD_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x92400e,
  roughness: 0.65,
  metalness: 0.08,
});

const SUPPORT_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x92400e,
  roughness: 0.7,
  metalness: 0.05,
});

const EDGE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x1a0a03 });
const DIM_MATERIAL = new THREE.MeshBasicMaterial({ color: 0x444444 });
const SHARED_MATERIALS = [WOOD_MATERIAL, SUPPORT_MATERIAL, EDGE_MATERIAL, DIM_MATERIAL];

const disposeObject = (object) => {
  object.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    const materials = Array.isArray(child.material)
      ? child.material
      : child.material
        ? [child.material]
        : [];

    materials.forEach((material) => {
      if (material.map) {
        material.map.dispose();
      }

      if (!SHARED_MATERIALS.includes(material)) {
        material.dispose();
      }
    });
  });
};

function PrateleiraMaoFrancesa3D({
  width = 80,
  height = 25,
  depth = 20,
  slatsPerShelf = 4,
}) {
  const sceneRef = useRef(null);
  const modelGroupRef = useRef(null);
  const exportHandlerRef = useRef(null);

  useEffect(() => {
    if (sceneRef.current) {
      return undefined;
    }

    const scene = new SceneInit("prateleiraMaoFrancesaThreeJsCanvas");
    scene.initialize();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(500, 500, 500);
    scene.scene.add(directionalLight);

    const softLight = new THREE.PointLight(0xfff3c7, 0.4);
    softLight.position.set(-200, 300, 0);
    scene.scene.add(softLight);

    sceneRef.current = scene;

    return () => {
      if (modelGroupRef.current) {
        scene.scene.remove(modelGroupRef.current);
        disposeObject(modelGroupRef.current);
        modelGroupRef.current = null;
      }

      scene.destroy();
      sceneRef.current = null;
      exportHandlerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sceneObject = sceneRef.current;

    if (!sceneObject) {
      return undefined;
    }

    if (modelGroupRef.current) {
      sceneObject.scene.remove(modelGroupRef.current);
      disposeObject(modelGroupRef.current);
    }

    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    sceneObject.scene.add(modelGroup);

    const addMeshWithEdges = (geometry, position, rotationZ = 0, material = WOOD_MATERIAL) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.rotation.z = rotationZ;
      modelGroup.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(edges, EDGE_MATERIAL);
      line.position.set(...position);
      line.rotation.z = rotationZ;
      modelGroup.add(line);
    };

    const addShelf = () => {
      const wallBackX = -ESPESSURA;
      const slatGeometry = new THREE.BoxGeometry(
        RIPA_LARGURA,
        RIPA_ALTURA,
        width - RIPA_LARGURA
      );
      const usableGap = Math.max(depth - slatsPerShelf * RIPA_LARGURA, 0);
      const gap = slatsPerShelf > 1 ? usableGap / (slatsPerShelf - 1) : 0;
      const shelfY = height + RIPA_ALTURA / 2;

      for (let slatIndex = 0; slatIndex < slatsPerShelf; slatIndex += 1) {
        addMeshWithEdges(slatGeometry, [
          wallBackX + RIPA_LARGURA / 2 + slatIndex * (gap + RIPA_LARGURA),
          shelfY,
          0,
        ]);
      }
    };

    const addBracket = (z) => {
      const wallLength = height - ESPESSURA;
      const supportRun = getSupportRun(height, depth);
      const topBottom = height - ESPESSURA;
      const base = topBottom - supportRun;
      const cut = (ESPESSURA / 2) * Math.SQRT2;

      const wallGeometry = new THREE.BoxGeometry(ESPESSURA, wallLength, LARGURA_PECA);
      addMeshWithEdges(
        wallGeometry,
        [-ESPESSURA / 2, wallLength / 2, z],
        0,
        SUPPORT_MATERIAL
      );

      const topGeometry = new THREE.BoxGeometry(depth, ESPESSURA, LARGURA_PECA);
      addMeshWithEdges(
        topGeometry,
        [-ESPESSURA + depth / 2, height - ESPESSURA / 2, z],
        0,
        SUPPORT_MATERIAL
      );

      const shape = new THREE.Shape();
      shape.moveTo(0, base - cut);
      shape.lineTo(supportRun + cut, topBottom);
      shape.lineTo(supportRun - cut, topBottom);
      shape.lineTo(0, base + cut);
      shape.closePath();

      const supportGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: LARGURA_PECA,
        bevelEnabled: false,
      });
      supportGeometry.translate(0, 0, -LARGURA_PECA / 2);

      addMeshWithEdges(supportGeometry, [0, 0, z], 0, SUPPORT_MATERIAL);
    };

    const createTextSprite = (text, scaleFactor) => {
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
    };

    const addRod = (start, end, lineRadius) => {
      const s = new THREE.Vector3(...start);
      const e = new THREE.Vector3(...end);
      const dir = new THREE.Vector3().subVectors(e, s);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
      const geometry = new THREE.CylinderGeometry(lineRadius, lineRadius, len, 6);
      const mesh = new THREE.Mesh(geometry, DIM_MATERIAL);

      mesh.position.copy(mid);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      modelGroup.add(mesh);
    };

    const addDimensionLine = (start, end, label, scaleFactor, lineRadius) => {
      addRod(start, end, lineRadius);

      const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start)).normalize();
      const tickSize = 3 * scaleFactor;
      const up = new THREE.Vector3(0, 1, 0);
      let perp = new THREE.Vector3().crossVectors(dir, up).normalize();

      if (perp.length() < 0.1) {
        perp = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(1, 0, 0)).normalize();
      }

      [new THREE.Vector3(...start), new THREE.Vector3(...end)].forEach((point) => {
        const t1 = point.clone().add(perp.clone().multiplyScalar(tickSize));
        const t2 = point.clone().add(perp.clone().multiplyScalar(-tickSize));
        addRod([t1.x, t1.y, t1.z], [t2.x, t2.y, t2.z], lineRadius);
      });

      const mid = new THREE.Vector3(...start)
        .add(new THREE.Vector3(...end))
        .multiplyScalar(0.5);
      const sprite = createTextSprite(label, scaleFactor);
      sprite.position.copy(mid);
      modelGroup.add(sprite);
    };

    addShelf();

    const shelfEdgeZ = (width - RIPA_LARGURA) / 2;
    const bracketZ = shelfEdgeZ - LARGURA_PECA / 2;
    addBracket(-bracketZ);
    addBracket(bracketZ);

    const box = new THREE.Box3().setFromObject(modelGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim / 60;
    const offset = 3.5 * scaleFactor;
    const lineRadius = 0.3 * scaleFactor;
    const totalHeight = size.y + offset * 2 + 10;
    const totalWidth = (size.x + size.z) * 0.7 + offset * 2 + 10;

    addDimensionLine(
      [depth - ESPESSURA + offset, height + ESPESSURA, -width / 2],
      [depth - ESPESSURA + offset, height + ESPESSURA, width / 2],
      `${width} cm`,
      scaleFactor,
      lineRadius
    );
    addDimensionLine(
      [-ESPESSURA, height + ESPESSURA + offset, width / 2 + offset],
      [depth - ESPESSURA, height + ESPESSURA + offset, width / 2 + offset],
      `${depth} cm`,
      scaleFactor,
      lineRadius
    );
    addDimensionLine(
      [-ESPESSURA - offset, 0, width / 2 + offset],
      [-ESPESSURA - offset, height, width / 2 + offset],
      `${height} cm`,
      scaleFactor,
      lineRadius
    );

    const fovRad = sceneObject.camera.fov * (Math.PI / 180);
    const aspect = sceneObject.camera.aspect;
    const distForHeight = totalHeight / (2 * Math.tan(fovRad / 2));
    const distForWidth = totalWidth / (2 * Math.tan(fovRad / 2) * aspect);
    const fitDist = Math.max(distForHeight, distForWidth) * 1.18;
    const camDir = new THREE.Vector3(1, 0.45, 1).normalize();

    sceneObject.camera.position.set(
      center.x + camDir.x * fitDist,
      center.y + camDir.y * fitDist,
      center.z + camDir.z * fitDist
    );
    sceneObject.camera.lookAt(center);
    sceneObject.controls.target.copy(center);
    sceneObject.controls.update();
    sceneObject.render();

    const exportBtn = document.getElementById("button-prateleira-mao-francesa");

    if (exportBtn && exportHandlerRef.current) {
      exportBtn.removeEventListener("click", exportHandlerRef.current);
    }

    const handleExport = () => {
      const exporter = new STLExporter();
      const stlString = exporter.parse(modelGroup);
      const blob = new Blob([stlString], { type: "text/plain" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = "prateleira-mao-francesa-pinus.stl";
      link.click();
      URL.revokeObjectURL(link.href);
    };

    exportHandlerRef.current = handleExport;
    exportBtn?.addEventListener("click", handleExport);

    return () => {
      exportBtn?.removeEventListener("click", handleExport);
    };
  }, [width, height, depth, slatsPerShelf]);

  return (
    <div className="w-full h-full relative">
      <canvas id="prateleiraMaoFrancesaThreeJsCanvas" className="w-full h-full block" />
    </div>
  );
}

export default PrateleiraMaoFrancesa3D;
