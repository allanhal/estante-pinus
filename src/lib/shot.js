import * as THREE from "three";

// Modo foto: usado por scripts/gen-thumbs.mjs para gerar as miniaturas 3D da loja.
export const isShot = () =>
  typeof window !== "undefined" &&
  (window.__SHOT__ === true || new URLSearchParams(window.location.search).get("shot") === "1");

export const SHOT_BG = 0x1c1917;

// Camera FIXA: enquadra sempre a mesma extensao do mundo (refExtent, em cm de altura
// visivel no alvo), entao produtos fisicamente maiores ocupam proporcionalmente mais
// do quadro. floorAnchored: o piso do modelo fica numa posicao constante da tela.
export function applyShotCamera(sceneObject, box, camDir, refExtent, { floorAnchored = false } = {}) {
  const center = box.getCenter(new THREE.Vector3());
  const target = center.clone();
  if (floorAnchored) target.y = box.min.y + refExtent * 0.42;
  const fovRad = sceneObject.camera.fov * (Math.PI / 180);
  const dist = refExtent / (2 * Math.tan(fovRad / 2));
  const dir = camDir.clone().normalize();
  sceneObject.camera.position.copy(target).addScaledVector(dir, dist);
  sceneObject.camera.lookAt(target);
  sceneObject.controls.target.copy(target);
  sceneObject.controls.update();
  sceneObject.render();
}
