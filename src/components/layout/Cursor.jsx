import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCursor } from "../../store/useCursor";

const RING_SIZE = 34;

const RING_SCALE = {
  default: 1,
  hover: 1.55,
  link: 1.35,
  card: 2.3,
  view: 2.7,
  drag: 1.4,
  text: 0.32,
};

const GLOW_SCALE = {
  default: 1.4,
  hover: 2.1,
  link: 1.8,
  card: 2.6,
  view: 2.9,
  drag: 1.9,
  text: 0.9,
};

const RING_FILLED = new Set(["view", "drag"]);
const RING_DASHED = new Set(["link", "card", "view"]);
const RING_PULSE = new Set(["card"]);

export function Cursor() {
  const cursorState = useCursor((s) => s.state);
  const label = useCursor((s) => s.label);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const shouldRender = !reducedMotion && !isMobile;

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // ring trails the raw pointer for a tight, responsive follow
  const ringX = useSpring(dotX, { stiffness: 420, damping: 34, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 420, damping: 34, mass: 0.4 });

  // outer glow trails a little further behind for a sense of depth
  const glowX = useSpring(dotX, { stiffness: 160, damping: 26, mass: 0.7 });
  const glowY = useSpring(dotY, { stiffness: 160, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (!shouldRender) return undefined;

    document.documentElement.classList.add("cursor-hidden");

    const handleMove = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [shouldRender, dotX, dotY]);

  if (!shouldRender) return null;

  const filled = RING_FILLED.has(cursorState);
  const dashed = RING_DASHED.has(cursorState);
  const pulsing = RING_PULSE.has(cursorState);
  const isText = cursorState === "text";

  return (
    <div className="pointer-events-none fixed inset-0 z-[999]" aria-hidden="true">
      {/* soft colored halo — sits outside the blend layer so it always reads as a glow */}
      <motion.div
        className="fixed left-0 top-0 rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: RING_SIZE * 2.4,
          height: RING_SIZE * 2.4,
          background:
            "radial-gradient(circle, rgba(79,47,240,0.5) 0%, rgba(79,47,240,0.16) 45%, transparent 72%)",
          filter: "blur(2px)",
        }}
        animate={{ scale: GLOW_SCALE[cursorState] ?? 1.4, opacity: cursorState === "text" ? 0.5 : 0.85 }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
      />

      {/* dot + ring — mix-blend-difference guarantees contrast on any surface */}
      <div className="fixed inset-0 mix-blend-difference">
        {!isText && (
          <motion.div
            className="fixed left-0 top-0 rounded-full bg-bone"
            style={{
              x: dotX,
              y: dotY,
              translateX: "-50%",
              translateY: "-50%",
              width: 8,
              height: 8,
            }}
            animate={{ opacity: filled ? 0 : 1, scale: pulsing ? [1, 0.6, 1] : 1 }}
            transition={{ duration: pulsing ? 1.6 : 0.15, repeat: pulsing ? Infinity : 0, ease: "easeInOut" }}
          />
        )}

        <motion.div
          className="fixed left-0 top-0 flex items-center justify-center rounded-full border-[1.5px] border-bone"
          style={{
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
            width: RING_SIZE,
            height: RING_SIZE,
            borderStyle: dashed ? "dashed" : "solid",
          }}
          animate={{
            scale: RING_SCALE[cursorState] ?? 1,
            backgroundColor: filled ? "#4F2FF0" : "rgba(0,0,0,0)",
            rotate: dashed ? 360 : 0,
            width: isText ? 2 : RING_SIZE,
            height: isText ? 22 : RING_SIZE,
            borderRadius: isText ? 2 : "9999px",
          }}
          transition={{
            scale: { type: "spring", stiffness: 320, damping: 24 },
            backgroundColor: { duration: 0.25 },
            rotate: { duration: 5.5, repeat: dashed ? Infinity : 0, ease: "linear" },
            width: { type: "spring", stiffness: 320, damping: 26 },
            height: { type: "spring", stiffness: 320, damping: 26 },
          }}
        >
          {label && filled && (
            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-bone">
              {label}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
