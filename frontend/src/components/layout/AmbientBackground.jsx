import { useEffect, useRef } from "react";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";

/**
 * Fixed, full-page ambient motion layer: drifting gradient blobs, a faint
 * grid, and a soft glow that trails the cursor. Sits behind all section
 * content (rendered before <main> with no elevated z-index) and never
 * intercepts pointer events.
 */
export function AmbientBackground() {
  const glowRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reducedMotion || isMobile || !glowRef.current) return undefined;

    const setX = gsap.quickTo(glowRef.current, "x", { duration: 1.1, ease: "power3.out" });
    const setY = gsap.quickTo(glowRef.current, "y", { duration: 1.1, ease: "power3.out" });

    const handleMove = (e) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion, isMobile]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute left-[8%] top-[10%] h-[38vw] w-[38vw] max-h-[520px] max-w-[520px] rounded-full opacity-[0.16] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(79,47,240,0.9), transparent 70%)",
          animation: reducedMotion ? "none" : "aurora-drift-a 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[6%] top-[45%] h-[32vw] w-[32vw] max-h-[440px] max-w-[440px] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,174,53,0.85), transparent 70%)",
          animation: reducedMotion ? "none" : "aurora-drift-b 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[5%] left-[30%] h-[28vw] w-[28vw] max-h-[380px] max-w-[380px] rounded-full opacity-[0.1] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(79,47,240,0.7), transparent 70%)",
          animation: reducedMotion ? "none" : "aurora-drift-a 24s ease-in-out infinite reverse",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          animation: reducedMotion ? "none" : "grid-pan 30s linear infinite",
        }}
      />

      {!reducedMotion && !isMobile && (
        <div
          ref={glowRef}
          className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(79,47,240,1), transparent 70%)" }}
        />
      )}
    </div>
  );
}
