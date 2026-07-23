import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const DEFAULT_SPRING = { stiffness: 60, damping: 20 };

export function useMouse(springConfig = DEFAULT_SPRING) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y]);

  return { x, y, springX, springY };
}
