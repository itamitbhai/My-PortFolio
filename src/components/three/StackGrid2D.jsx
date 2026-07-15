import { motion } from "framer-motion";
import { useState } from "react";
import * as SiIcons from "react-icons/si";

import { stack } from "../../content/stack";

export function StackGrid2D({ activeCategory = null }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
      role="img"
      aria-label={`Tech stack: ${stack.map((s) => s.name).join(", ")}`}
    >
      {stack.map((item, index) => {
        const Icon = SiIcons[item.icon];
        const isHovered = hovered === item.name;
        const dimmed = Boolean(activeCategory) && activeCategory !== item.cat;

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: dimmed ? 0.15 : 1, y: 0 }}
            animate={{ opacity: dimmed ? 0.15 : 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            className="flex flex-col items-center justify-center gap-3 border border-current/10 p-6 transition-colors"
          >
            {Icon ? (
              <Icon
                className="h-8 w-8 transition-colors"
                style={{ color: isHovered ? "#4F2FF0" : "currentColor" }}
              />
            ) : (
              <div className="h-8 w-8" />
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.12em]">{item.name}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
