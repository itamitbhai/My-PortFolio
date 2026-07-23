import { motion } from "framer-motion";
import { useState } from "react";
import * as SiIcons from "react-icons/si";

import { stack } from "../../content/stack";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCursor } from "../../store/useCursor";
import { TiltCard } from "../ui/TiltCard";

export function StackGrid2D({ activeCategory = null }) {
  const [hovered, setHovered] = useState(null);
  const reducedMotion = useReducedMotion();
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  return (
    <div
      className="relative grid w-full auto-rows-fr grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5"
      role="img"
      aria-label={`Tech stack: ${stack.map((s) => s.name).join(", ")}`}
    >
      {/* faint connective grid field behind the icons */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          animation: reducedMotion ? "none" : "grid-pan 24s linear infinite",
        }}
      />

      {stack.map((item, index) => {
        const Icon = SiIcons[item.icon];
        const isHovered = hovered === item.name;
        const dimmed = Boolean(activeCategory) && activeCategory !== item.cat;

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: dimmed ? 0.15 : 1, y: 0, scale: 1 }}
            animate={{ opacity: dimmed ? 0.15 : 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: index * 0.045, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <TiltCard max={10} className="h-full">
              <div
                onMouseEnter={() => {
                  setHovered(item.name);
                  setCursor("card");
                }}
                onMouseLeave={() => {
                  setHovered(null);
                  resetCursor();
                }}
                className="glass-panel group relative flex h-full min-h-[132px] flex-col items-center justify-center gap-4 overflow-hidden rounded-none p-6 transition-[border-color,transform] duration-300 md:min-h-[152px] md:p-7"
                style={{
                  borderColor: isHovered ? "rgba(79,47,240,0.55)" : undefined,
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? "0 22px 45px -20px rgba(79,47,240,0.45), 0 0 0 1px rgba(79,47,240,0.25) inset"
                    : "0 18px 36px -26px rgba(0,0,0,0.55)",
                  transition: "border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease",
                }}
              >
                {/* corner ticks for a premium, framed feel */}
                <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-current/25" />
                <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-current/25" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-current/25" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-current/25" />

                <div
                  className={reducedMotion ? "" : "float-y-sm"}
                  style={{ animationDelay: `${(index % 6) * 0.35}s` }}
                >
                  {Icon ? (
                    <Icon
                      className="h-9 w-9 transition-colors duration-300 md:h-10 md:w-10"
                      style={{
                        color: isHovered ? "#4F2FF0" : "currentColor",
                        filter: isHovered ? "drop-shadow(0 0 12px rgba(79,47,240,0.7))" : "none",
                      }}
                    />
                  ) : (
                    <div className="h-9 w-9 md:h-10 md:w-10" />
                  )}
                </div>
                <span className="text-center font-mono text-[12px] font-medium uppercase tracking-[0.14em] md:text-[13px]">
                  {item.name}
                </span>
              </div>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}
