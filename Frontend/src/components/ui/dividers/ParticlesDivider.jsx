import { useEffect, useMemo, useRef } from "react";

import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { gsap } from "../../../lib/gsap";

const COUNT = 22;

/** Floating particles that drift upward continuously, fading in as the band enters view. */
export function ParticlesDivider() {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        left: `${(i / COUNT) * 100 + (Math.random() * 4 - 2)}%`,
        size: 2 + Math.round(Math.random() * 3),
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 5,
        drift: `${Math.random() * 30 - 15}px`,
        amber: i % 4 === 0,
      })),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "top 50%",
            scrub: 0.6,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative h-24 w-full overflow-hidden md:h-32">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-4 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            "--drift": p.drift,
            background: p.amber ? "#FFAE35" : "#4F2FF0",
            opacity: reducedMotion ? 0.4 : 0,
            animation: reducedMotion
              ? "none"
              : `particle-rise ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        style={{
          background: "radial-gradient(60% 100% at 50% 100%, rgba(79,47,240,0.08), transparent 70%)",
        }}
      />
    </div>
  );
}
