import { useEffect, useRef } from "react";

import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { gsap } from "../../../lib/gsap";

/** Two soft blurred blobs drifting past each other, brightening as the band scrolls into view. */
export function AuroraDivider() {
  const rootRef = useRef(null);
  const bandRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bandRef.current,
        { opacity: 0, filter: "blur(20px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "power1.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.6,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative h-28 w-full overflow-hidden md:h-40">
      <div ref={bandRef} className="absolute inset-0">
        <div
          className="absolute left-1/4 top-1/2 h-32 w-56 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(79,47,240,0.35), transparent 70%)",
            animation: reducedMotion ? "none" : "aurora-drift-a 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-1/4 top-1/2 h-28 w-64 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,174,53,0.28), transparent 70%)",
            animation: reducedMotion ? "none" : "aurora-drift-b 11s ease-in-out infinite",
          }}
        />
      </div>
      <div className="absolute inset-x-0 top-1/2 h-px w-full bg-current/10" />
    </div>
  );
}
