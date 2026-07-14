"use client";

import { useEffect } from "react";
import { type MotionValue, useMotionValue, useSpring } from "motion/react";

interface UseMouseResult {
  x: MotionValue<number>;
  y: MotionValue<number>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
}

const DEFAULT_SPRING: SpringConfig = { stiffness: 60, damping: 20 };

export function useMouse(springConfig: SpringConfig = DEFAULT_SPRING): UseMouseResult {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  return { x, y, springX, springY };
}
