import { MeshTransmissionMaterial } from "@react-three/drei";
import { forwardRef } from "react";

export const GlassCore = forwardRef(function GlassCore(_props, ref) {
  return (
    <mesh ref={ref} scale={0}>
      <icosahedronGeometry args={[1.6, 0]} />
      <MeshTransmissionMaterial
        thickness={0.8}
        roughness={0.1}
        chromaticAberration={0.05}
        ior={1.4}
        transmission={1}
        color="#e9e6df"
        backside
      />
    </mesh>
  );
});
