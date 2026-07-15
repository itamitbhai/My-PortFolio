import { motion } from "framer-motion";

export function MaskReveal({ children, delay = 0, className = "", as: Component = "div" }) {
  const isInline = className.includes("inline") || className.includes("inline-block") || Component === "span";
  const displayClass = isInline ? "inline-block" : "block";
  const childDisplayClass = isInline ? "inline-block" : "block";

  return (
    <Component className={`${displayClass} overflow-hidden ${className}`}>
      <motion.span
        className={childDisplayClass}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Component>
  );
}
