import { useEffect, useRef } from "react";

import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { gsap } from "../../../lib/gsap";

/** A glowing gradient line that expands from center, with a pulsing radial core. */
export function GlowLineDivider() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const glowRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(glowRef.current, { scale: 0.3, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: reducedMotion ? false : 0.6,
        },
      });

      tl.to(lineRef.current, { scaleX: 1, ease: "power2.out" }, 0).to(
        glowRef.current,
        { scale: 1, opacity: 1, ease: "power2.out" },
        0
      );

      if (!reducedMotion) {
        gsap.to(glowRef.current, {
          opacity: 0.5,
          duration: 1.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.5,
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative flex h-24 w-full items-center justify-center overflow-hidden md:h-32">
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-16 w-16 rounded-full blur-2xl md:h-24 md:w-24"
        style={{ background: "radial-gradient(circle, rgba(79,47,240,0.55), transparent 70%)" }}
      />
      <div
        ref={lineRef}
        className="h-px w-full origin-center"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(79,47,240,0.7) 25%, rgba(255,174,53,0.8) 50%, rgba(79,47,240,0.7) 75%, transparent)",
        }}
      />
    </div>
  );
}
