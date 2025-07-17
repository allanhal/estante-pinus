import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import STLModel from "./STLModel";

export default function STLImporter() {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 40 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <STLModel url="/model.stl" />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
