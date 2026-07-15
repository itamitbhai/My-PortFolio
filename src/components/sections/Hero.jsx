import { motion, useTransform } from "framer-motion";
import { lazy, Suspense } from "react";

import { site } from "../../content/site";
import { stack } from "../../content/stack";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMouse } from "../../hooks/useMouse";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { hasWebGL } from "../../lib/utils";
import { useCursor } from "../../store/useCursor";
import { RouteLabel } from "../layout/RouteLabel";
import { StatusPill } from "../layout/StatusPill";
import { Magnetic } from "../ui/Magnetic";
import { MaskReveal } from "../ui/MaskReveal";

const HeroScene = lazy(() => import("../three/HeroScene").then((mod) => ({ default: mod.HeroScene })));

const FEATURED_STACK = ["React", "Node.js", "PostgreSQL", "AWS"];

function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-20 h-4 w-4 border-l border-t border-current/15 md:left-6 md:top-24"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-20 h-4 w-4 border-r border-t border-current/15 md:right-6 md:top-24"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-4 h-4 w-4 border-b border-l border-current/15 md:bottom-28 md:left-6"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 right-4 h-4 w-4 border-b border-r border-current/15 md:bottom-28 md:right-6"
      />
    </>
  );
}

function PortraitCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      <div className="relative isolate aspect-[4/5] w-full overflow-hidden border border-current/15 bg-current/5">
        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-current/40" />
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-current/40" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-current/40" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-current/40" />

        <img
          src={site.portrait}
          alt={`Portrait of ${site.name}`}
          fetchPriority="high"
          className="h-full w-full object-cover grayscale contrast-[1.08]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-uv/[0.18] mix-blend-color" />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-current/10 bg-bone/80 px-3 py-2.5 backdrop-blur-sm">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{site.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate">{site.role}</span>
        </div>
      </div>

      <div className="absolute -right-2 -top-2 origin-top-right scale-90">
        <StatusPill />
      </div>
    </motion.div>
  );
}

function DetailPanel() {
  const featuredStack = stack.filter((item) => FEATURED_STACK.includes(item.name));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full flex-col gap-8"
    >
      <div className="grid grid-cols-2 gap-6">
        {site.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display text-3xl tracking-[-0.02em]">{stat.value}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate">Core stack</span>
        <div className="flex flex-wrap gap-2">
          {featuredStack.map((item) => (
            <span
              key={item.name}
              className="border border-current/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 hover:border-current/30 hover:bg-current/5"
            >
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const { springX, springY } = useMouse();
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const use3D = !isMobile && !reducedMotion && hasWebGL();

  const nameX = useTransform(springX, [0, window.innerWidth], [-8, 8]);
  const nameY = useTransform(springY, [0, window.innerHeight], [-8, 8]);

  const nameLines = site.name.split(" ");

  return (
    <section
      id="index"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pb-10 pt-24 md:px-10 md:pt-28"
    >
      <CornerBrackets />

      {use3D && (
        <Suspense fallback={null}>
          <HeroScene mouseX={springX} mouseY={springY} />
        </Suspense>
      )}

      <RouteLabel label="/index" />

      <div className="relative z-10 mt-12 flex flex-1 flex-col justify-start gap-12 md:mt-16 md:flex-row md:items-start md:justify-between md:gap-10">
        <div className="flex max-w-2xl flex-col gap-6">
          <MaskReveal as="div">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber" />
              {site.role} — {site.location}
            </span>
          </MaskReveal>

          <motion.h1
            style={{ x: nameX, y: nameY }}
            className="font-display text-display leading-[0.9] tracking-[-0.03em] flex flex-wrap gap-x-[0.3em] gap-y-1"
          >
            {nameLines.map((word, i) => (
              <MaskReveal key={word} delay={0.08 * i} as="span" className="inline-block">
                {word}
              </MaskReveal>
            ))}
          </motion.h1>

          <MaskReveal delay={0.08 * nameLines.length} as="div">
            <p className="max-w-[38ch] font-body text-lg text-slate md:text-xl">{site.tagline}</p>
          </MaskReveal>

          <MaskReveal delay={0.08 * nameLines.length + 0.1} as="div">
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic className="w-fit">
                <a
                  href="#contact"
                  onMouseEnter={() => setCursor("hover")}
                  onMouseLeave={resetCursor}
                  className="group relative inline-block overflow-hidden border border-current/15 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-bone">Let's talk</span>
                  <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-ink transition-transform duration-300 ease-[0.16,1,0.3,1] group-hover:scale-y-100" />
                </a>
              </Magnetic>

              <Magnetic className="w-fit">
                <a
                  href="#work"
                  onMouseEnter={() => setCursor("hover")}
                  onMouseLeave={resetCursor}
                  className="group inline-flex items-center gap-2 px-4 py-4 font-mono text-[11px] uppercase tracking-[0.12em] text-slate transition-colors hover:text-uv"
                >
                  View work <span className="transition-transform duration-300 ease-out group-hover:translate-y-1">↓</span>
                </a>
              </Magnetic>
            </div>
          </MaskReveal>
        </div>

        <div className="flex w-full flex-col gap-10 border-t border-current/10 pt-8 md:w-72 md:shrink-0 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <PortraitCard />
          <DetailPanel />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
        <span>Scroll</span>
        <div className="h-10 w-px overflow-hidden bg-current/10">
          <motion.div
            className="h-full w-full bg-uv"
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
