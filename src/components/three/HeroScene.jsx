import { Canvas } from "@react-three/fiber";

import { WireframeCore } from "./WireframeCore";

export function HeroScene({ mouseX, mouseY }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <WireframeCore mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}
