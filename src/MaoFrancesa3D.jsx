import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import SceneInit from "./lib/SceneInit";
import { ESPESSURA, LARGURA_PECA, getSupportRun } from "./MaoFrancesa";

const BOX_MATERIAL = new THREE.MeshStandardMaterial({
  color: 0x92400e,
  roughness: 0.7,
  metalness: 0.05,
});

const EDGE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x1a0a03 });
const DIM_MATERIAL = new THREE.MeshBasicMaterial({ color: 0x444444 });
const SHARED_MATERIALS = [BOX_MATERIAL, EDGE_MATERIAL, DIM_MATERIAL];

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

function MaoFrancesa3D({ height = 25, depth = 25 }) {
  const width = LARGURA_PECA;

  const sceneRef = useRef(null);
  const modelGroupRef = useRef(null);
  const exportHandlerRef = useRef(null);

  useEffect(() => {
    if (sceneRef.current) {
      return undefined;
    }

    const scene = new SceneInit("maoFrancesaThreeJsCanvas");
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

    // Eixos: x sai da parede (profundidade), y é a altura, z é a largura.
    const addMeshWithEdges = (geometry, position, rotationZ = 0, material = BOX_MATERIAL) => {
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

    const supportRun = getSupportRun(height, depth);
    const bracoY = height - ESPESSURA / 2;
    const wallComprimento = height - ESPESSURA;
    const topFim = depth - ESPESSURA;

    const addWall = () => {
      const geometry = new THREE.BoxGeometry(ESPESSURA, wallComprimento, width);
      addMeshWithEdges(geometry, [-ESPESSURA / 2, wallComprimento / 2, 0]);
    };

    const addTop = () => {
      const geometry = new THREE.BoxGeometry(depth, ESPESSURA, width);
      addMeshWithEdges(geometry, [-ESPESSURA + depth / 2, bracoY, 0]);
    };

    const addSupport = () => {
      const topBottom = height - ESPESSURA;
      const base = topBottom - supportRun;
      const cut = (ESPESSURA / 2) * Math.SQRT2;

      const shape = new THREE.Shape();
      shape.moveTo(0, base - cut);
      shape.lineTo(supportRun + cut, topBottom);
      shape.lineTo(supportRun - cut, topBottom);
      shape.lineTo(0, base + cut);
      shape.closePath();

      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: width,
        bevelEnabled: false,
      });
      geometry.translate(0, 0, -width / 2);

      addMeshWithEdges(geometry, [0, 0, 0]);
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

    addWall();
    addTop();
    addSupport();

    const box = new THREE.Box3().setFromObject(modelGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim / 60;
    const offset = 8 * scaleFactor;
    const lineRadius = 0.3 * scaleFactor;
    const totalHeight = size.y + offset * 2 + 10;
    const totalWidth = (size.x + size.z) * 0.7 + offset * 2 + 10;

    addDimensionLine(
      [-ESPESSURA, 0, width / 2 + offset],
      [-ESPESSURA, height, width / 2 + offset],
      `${height} cm`,
      scaleFactor,
      lineRadius
    );
    addDimensionLine(
      [-ESPESSURA, height + offset, width / 2 + offset],
      [topFim, height + offset, width / 2 + offset],
      `${depth} cm`,
      scaleFactor,
      lineRadius
    );

    const fovRad = sceneObject.camera.fov * (Math.PI / 180);
    const aspect = sceneObject.camera.aspect;
    const distForHeight = totalHeight / (2 * Math.tan(fovRad / 2));
    const distForWidth = totalWidth / (2 * Math.tan(fovRad / 2) * aspect);
    const fitDist = Math.max(distForHeight, distForWidth) * 1.15;
    const camDir = new THREE.Vector3(1, 0.35, 1).normalize();

    sceneObject.camera.position.set(
      center.x + camDir.x * fitDist,
      center.y + camDir.y * fitDist,
      center.z + camDir.z * fitDist
    );
    sceneObject.camera.lookAt(center);
    sceneObject.controls.target.copy(center);
    sceneObject.controls.update();
    sceneObject.render();

    const exportBtn = document.getElementById("button-mao-francesa");

    const handleExport = () => {
      const exporter = new STLExporter();
      const stlString = exporter.parse(modelGroup);
      const blob = new Blob([stlString], { type: "text/plain" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = "mao-francesa-pinus.stl";
      link.click();
      URL.revokeObjectURL(link.href);
    };

    exportHandlerRef.current = handleExport;
    exportBtn?.addEventListener("click", handleExport);

    return () => {
      exportBtn?.removeEventListener("click", handleExport);
    };
  }, [width, height, depth]);

  return (
    <div className="w-full h-full relative">
      <canvas id="maoFrancesaThreeJsCanvas" className="w-full h-full block" />
    </div>
  );
}

export default MaoFrancesa3D;
