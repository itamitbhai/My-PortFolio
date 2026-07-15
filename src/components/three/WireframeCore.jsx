import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const TILT_LERP = 0.04;
const TILT_RANGE_X = 0.2;
const TILT_RANGE_Y = 0.25;

export function WireframeCore({ mouseX, mouseY }) {
  const tiltRef = useRef(null);
  const spinRef = useRef(null);

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.12;
      spinRef.current.rotation.x += delta * 0.05;
    }

    if (tiltRef.current && mouseX && mouseY) {
      const nx = (mouseX.get() / window.innerWidth) * 2 - 1;
      const ny = (mouseY.get() / window.innerHeight) * 2 - 1;
      tiltRef.current.rotation.x = THREE.MathUtils.lerp(
        tiltRef.current.rotation.x,
        ny * TILT_RANGE_X,
        TILT_LERP
      );
      tiltRef.current.rotation.y = THREE.MathUtils.lerp(
        tiltRef.current.rotation.y,
        nx * TILT_RANGE_Y,
        TILT_LERP
      );
    }
  });

  return (
    <group position={[1.7, 0.1, 0]}>
      <group ref={tiltRef}>
        <group ref={spinRef} rotation={[0.4, 0.6, 0]}>
          <mesh>
            <icosahedronGeometry args={[1.7, 0]} />
            <meshBasicMaterial color="#4F2FF0" wireframe transparent opacity={0.45} />
          </mesh>
          <mesh scale={1.35}>
            <icosahedronGeometry args={[1.7, 0]} />
            <meshBasicMaterial color="#4F2FF0" wireframe transparent opacity={0.12} />
          </mesh>
        </group>

        <Sparkles count={35} scale={4.2} size={2.2} speed={0.25} opacity={0.5} color="#FFAE35" />
      </group>
    </group>
  );
}
