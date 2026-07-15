import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

import { gsap } from "../../lib/gsap";
import { GlassCore } from "./GlassCore";
import { LogoCloud } from "./LogoCloud";

export function StackScene({ activeCategory, onHoverLogo, inView }) {
  const coreRef = useRef(null);
  const hasEntered = useRef(false);
  const resumeTimer = useRef(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!inView || hasEntered.current) return undefined;

    let raf;
    const tryStart = () => {
      if (!coreRef.current) {
        raf = requestAnimationFrame(tryStart);
        return;
      }
      hasEntered.current = true;
      const tl = gsap.timeline();
      tl.to(coreRef.current.scale, { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" });
      tl.from(coreRef.current.rotation, { y: Math.PI * 2, duration: 1.2, ease: "elastic.out(1, 0.5)" }, 0);
    };
    tryStart();

    return () => cancelAnimationFrame(raf);
  }, [inView]);

  useEffect(() => {
    const id = setTimeout(() => setShowHint(true), 1500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        frameloop={inView ? "always" : "never"}
      >
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <pointLight position={[-2, 0, -2]} intensity={3} color="#4F2FF0" />
        <Environment preset="city" />
        <GlassCore ref={coreRef} />
        <LogoCloud activeCategory={activeCategory} onHoverLogo={onHoverLogo} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.4}
          onStart={(e) => {
            setShowHint(false);
            clearTimeout(resumeTimer.current);
            e.target.autoRotate = false;
          }}
          onEnd={(e) => {
            resumeTimer.current = setTimeout(() => {
              e.target.autoRotate = true;
            }, 2000);
          }}
        />
      </Canvas>

      {showHint && (
        <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[#E9E6DF]/60 md:bottom-6 md:right-6">
          Drag to rotate
        </div>
      )}
    </div>
  );
}
