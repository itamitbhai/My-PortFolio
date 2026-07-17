import { motion } from "framer-motion";
import { useState } from "react";
import * as SiIcons from "react-icons/si";

import { stack } from "../../content/stack";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { TiltCard } from "../ui/TiltCard";

export function StackGrid2D({ activeCategory = null }) {
  const [hovered, setHovered] = useState(null);
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="relative grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
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
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            whileInView={{ opacity: dimmed ? 0.15 : 1, y: 0, scale: 1 }}
            animate={{ opacity: dimmed ? 0.15 : 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
          >
            <TiltCard max={10} className="h-full">
              <div
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center justify-center gap-3 border border-current/10 p-6 transition-colors duration-300 hover:border-uv/40"
                style={{
                  boxShadow: isHovered ? "0 0 28px rgba(79,47,240,0.28)" : "none",
                  transition: "box-shadow 0.35s ease",
                }}
              >
                <div
                  className={reducedMotion ? "" : "float-y-sm"}
                  style={{ animationDelay: `${(index % 6) * 0.35}s` }}
                >
                  {Icon ? (
                    <Icon
                      className="h-8 w-8 transition-colors duration-300"
                      style={{
                        color: isHovered ? "#4F2FF0" : "currentColor",
                        filter: isHovered ? "drop-shadow(0 0 10px rgba(79,47,240,0.65))" : "none",
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8" />
                  )}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em]">{item.name}</span>
              </div>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}
