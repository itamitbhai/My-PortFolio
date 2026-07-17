import { useEffect, useRef } from "react";

import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { gsap } from "../../../lib/gsap";

/** An SVG wave that draws itself in on scroll, with a soft gradient fill fading up beneath it. */
export function WaveDivider() {
  const rootRef = useRef(null);
  const pathRef = useRef(null);
  const fillRef = useRef(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return undefined;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          end: "top 25%",
          scrub: reducedMotion ? false : 0.7,
        },
      });

      tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0).fromTo(
        fillRef.current,
        { opacity: 0 },
        { opacity: 1, ease: "none" },
        0
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative h-24 w-full overflow-hidden md:h-32">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F2FF0" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#4F2FF0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          ref={fillRef}
          d="M0,70 C150,110 350,20 600,60 C850,100 1050,20 1200,55 L1200,120 L0,120 Z"
          fill="url(#wave-fill)"
        />
        <path
          ref={pathRef}
          d="M0,70 C150,110 350,20 600,60 C850,100 1050,20 1200,55"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
