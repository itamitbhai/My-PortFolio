import { useEffect, useRef } from "react";

import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { gsap } from "../../../lib/gsap";

/** A blurred beam of light that sweeps left-to-right as the band crosses the viewport. */
export function BeamDivider() {
  const rootRef = useRef(null);
  const beamRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        beamRef.current,
        { xPercent: -120 },
        {
          xPercent: 220,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 90%",
            end: "bottom 10%",
            scrub: reducedMotion ? false : 0.8,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative h-24 w-full overflow-hidden md:h-32">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current/10" />
      <div
        ref={beamRef}
        className="absolute top-0 h-full w-24 -translate-x-1/2 skew-x-[-12deg] blur-xl md:w-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(79,47,240,0.5) 40%, rgba(255,255,255,0.55) 50%, rgba(79,47,240,0.5) 60%, transparent)",
        }}
      />
    </div>
  );
}
