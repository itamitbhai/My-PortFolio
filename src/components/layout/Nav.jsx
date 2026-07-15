import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { site } from "../../content/site";
import { useCursor } from "../../store/useCursor";
import { Magnetic } from "../ui/Magnetic";
import { StatusPill } from "./StatusPill";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#work", label: "Work" },
  { href: "#timeline", label: "Timeline" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[200] flex items-center justify-between gap-4 border-b border-current/10 px-6 py-4 backdrop-blur-sm md:px-10"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg) 82%, transparent)",
        color: "var(--fg)",
      }}
    >
      <a
        href="#index"
        className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:text-uv"
      >
        {site.name}
      </a>

      <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.12em] text-slate md:flex">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors hover:text-uv">
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <StatusPill />
        </div>

        <Magnetic className="w-fit">
          <button
            onClick={toggleTheme}
            onMouseEnter={() => setCursor("hover")}
            onMouseLeave={resetCursor}
            className="relative flex h-8 w-8 items-center justify-center border border-current/15 bg-bone/80 text-ink backdrop-blur-sm transition-colors duration-300 hover:border-current/30 hover:bg-current/5"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" ? (
                <motion.svg
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </Magnetic>
      </div>
    </nav>
  );
}
