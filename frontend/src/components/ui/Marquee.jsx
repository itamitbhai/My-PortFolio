import { useEffect, useRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";

const KEYWORDS = ["REACT", "NODE", "POSTGRES", "DOCKER", "AWS", "GRAPHQL", "REDIS", "NEXT.JS", "TAILWIND"];

export function Marquee() {
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    const baseSpeed = 1.2;
    let rafId;

    const loop = () => {
      const lenis = getLenis();
      const velocity = lenis?.velocity ?? 0;
      const speed = baseSpeed + velocity * 0.6;

      xRef.current -= speed;

      const width = track.scrollWidth / 2;
      if (width > 0) {
        if (xRef.current <= -width) xRef.current += width;
        if (xRef.current > 0) xRef.current -= width;
      }

      gsap.set(track, { x: xRef.current });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const items = [...KEYWORDS, ...KEYWORDS];

  return (
    <div className="overflow-hidden border-y border-current/10 py-6">
      <div ref={trackRef} className="flex w-max gap-8 whitespace-nowrap will-change-transform">
        {items.map((word, i) => (
          <span key={i} className="font-display text-3xl tracking-[-0.02em] text-slate md:text-5xl">
            {word} <span className="text-uv">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
