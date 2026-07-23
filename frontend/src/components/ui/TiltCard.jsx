import { useRef } from "react";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";

/**
 * Wraps children in a perspective-tilt + cursor-following glow border.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function TiltCard({ children, className = "", max = 8, glow = true }) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const disabled = reducedMotion || isMobile;

  const handleMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    gsap.to(ref.current, {
      rotateX: (0.5 - py) * max,
      rotateY: (px - 0.5) * max,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 800,
      overwrite: true,
    });

    if (glow) {
      ref.current.style.setProperty("--glow-x", `${px * 100}%`);
      ref.current.style.setProperty("--glow-y", `${py * 100}%`);
    }
  };

  const handleLeave = () => {
    if (disabled || !ref.current) return;
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "power3.out", overwrite: true });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
