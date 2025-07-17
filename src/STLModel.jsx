import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import { MeshStandardMaterial } from "three";

export default function STLModel({ url }) {
  const geometry = useLoader(STLLoader, url);
  const material = new MeshStandardMaterial({
    color: "orange",
    metalness: 0.5,
    roughness: 0.2,
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      scale={0.5}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {/* Optional: Add shadows */}
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  );
}
