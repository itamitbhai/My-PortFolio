import { Float, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as SiIcons from "react-icons/si";
import * as THREE from "three";

import { stack } from "../../content/stack";

const REPEL_RADIUS = 1.1;
const REPEL_STRENGTH = 0.9;
const PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

function useHomePositions(count, radius) {
  return useMemo(() => {
    const positions = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      positions.push(
        new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius)
      );
    }
    return positions;
  }, [count, radius]);
}

function Logo({ item, homePosition, activeCategory, onHover }) {
  const groupRef = useRef(null);
  const currentPos = useRef(homePosition.clone());
  const pointerWorld = useRef(new THREE.Vector3());
  const [hovered, setHovered] = useState(false);
  const Icon = SiIcons[item.icon];

  const dimmed = Boolean(activeCategory) && activeCategory !== item.cat;
  const pulledForward = Boolean(activeCategory) && activeCategory === item.cat;

  useFrame((state) => {
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const hit = state.raycaster.ray.intersectPlane(PLANE, pointerWorld.current);

    let target = homePosition.clone();

    if (hit) {
      const dist = currentPos.current.distanceTo(pointerWorld.current);
      if (dist < REPEL_RADIUS) {
        const pushDir = currentPos.current.clone().sub(pointerWorld.current).normalize();
        const pushAmount = (REPEL_RADIUS - dist) * REPEL_STRENGTH;
        target = target.add(pushDir.multiplyScalar(pushAmount));
      }
    }

    if (pulledForward) target = target.multiplyScalar(1.15);
    if (dimmed) target = target.add(new THREE.Vector3(0, 0, -1));

    currentPos.current.lerp(target, 0.08);
    if (groupRef.current) {
      groupRef.current.position.copy(currentPos.current);
    }
  });

  return (
    <Float speed={1 + Math.random()} rotationIntensity={0.4} floatIntensity={0.8}>
      <group
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(item);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <Html center transform distanceFactor={6} style={{ pointerEvents: "auto" }}>
          <div
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border backdrop-blur-sm"
            style={{
              opacity: dimmed ? 0.15 : 1,
              background: hovered ? "rgba(79,47,240,0.16)" : "rgba(15,17,21,0.35)",
              borderColor: hovered ? "#4F2FF0" : "rgba(233,230,223,0.35)",
              borderWidth: hovered ? "1.5px" : "1px",
              boxShadow: hovered ? "0 0 22px rgba(79,47,240,0.55)" : "none",
              transform: hovered ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.25s ease, border-color 0.25s ease, opacity 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
            }}
          >
            {Icon && <Icon className="h-5 w-5" style={{ color: hovered ? "#4F2FF0" : "#E9E6DF" }} />}
          </div>
        </Html>
      </group>
    </Float>
  );
}

export function LogoCloud({ activeCategory, onHoverLogo }) {
  const positions = useHomePositions(stack.length, 2.2);

  return (
    <>
      {stack.map((item, i) => (
        <Logo
          key={item.name}
          item={item}
          homePosition={positions[i]}
          activeCategory={activeCategory}
          onHover={onHoverLogo}
        />
      ))}
    </>
  );
}
