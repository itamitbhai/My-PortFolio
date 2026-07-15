import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCursor } from "../../store/useCursor";

const RING_SCALE = {
  default: 1,
  hover: 1.6,
  drag: 1.3,
  view: 2.4,
  text: 0.4,
};

const RING_FILLED = new Set(["view", "drag"]);

export function Cursor() {
  const cursorState = useCursor((s) => s.state);
  const label = useCursor((s) => s.label);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldRender = !reducedMotion && !isMobile;

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30, mass: 0.5 });

  useEffect(() => {
    if (!shouldRender) return;

    document.documentElement.classList.add("cursor-hidden");

    const handleMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [shouldRender, dotX, dotY]);

  if (!shouldRender) return null;

  const filled = RING_FILLED.has(cursorState);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] mix-blend-difference" aria-hidden="true">
      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-bone"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: filled ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-bone"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: RING_SCALE[cursorState] ?? 1,
          backgroundColor: filled ? "#4F2FF0" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && filled && (
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-bone">{label}</span>
        )}
      </motion.div>
    </div>
  );
}
