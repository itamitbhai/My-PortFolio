import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { categories } from "../../content/stack";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import { hasWebGL } from "../../lib/utils";
import { useCursor } from "../../store/useCursor";
import { StackGrid2D } from "../three/StackGrid2D";
import { StackHUD } from "../three/StackHUD";
import { CharReveal } from "../ui/CharReveal";

const StackScene = lazy(() =>
  import("../three/StackScene").then((mod) => ({ default: mod.StackScene }))
);

function CategoryButton({ cat, active, onEnter, onLeave }) {
  const ref = useRef(null);
  const dotRef = useRef(null);
  const lineRef = useRef(null);
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: dx * 0.25, y: dy * 0.3, duration: 0.4, ease: "power2.out", overwrite: "auto" });
  };

  const handleLeave = () => {
    onLeave();
    resetCursor();
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
  };

  useEffect(() => {
    if (active) {
      gsap.to(ref.current, {
        color: "#4F2FF0",
        letterSpacing: "0.22em",
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        overwrite: "auto",
      });
      gsap.to(lineRef.current, {
        width: "100%",
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(ref.current, {
        color: "rgba(233,230,223,0.55)",
        letterSpacing: "0.16em",
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(dotRef.current, {
        scale: 0,
        duration: 0.3,
        ease: "power2.in",
        overwrite: "auto",
      });
      gsap.to(lineRef.current, {
        width: "0%",
        duration: 0.3,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [active]);

  return (
    <button
      ref={ref}
      type="button"
      data-cat-btn
      onMouseEnter={() => {
        onEnter();
        setCursor("hover");
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-fit font-mono text-[13px] font-medium uppercase transition-colors duration-300 md:text-[15px]"
      style={{ color: "rgba(233,230,223,0.55)", letterSpacing: "0.16em" }}
    >
      <span
        ref={dotRef}
        className="pointer-events-none absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-uv scale-0"
        aria-hidden="true"
      />
      {cat}
      <span
        ref={lineRef}
        className="pointer-events-none absolute -bottom-1.5 left-0 h-px bg-uv w-0"
        aria-hidden="true"
      />
    </button>
  );
}

export function Stack() {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const [inView, setInView] = useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const use3D = !isMobile && !reducedMotion && hasWebGL();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // scroll bg and fg updates
      gsap.to(document.documentElement, {
        "--scroll-bg": "#0F1115",
        "--scroll-fg": "#E9E6DF",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      });

      // slow parallax drift on the background glow
      gsap.to("[data-stack-glow]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // rail (category list) staggers up as the section enters
      if (railRef.current) {
        gsap.fromTo(
          railRef.current.querySelectorAll("[data-cat-btn]"),
          { opacity: 0, x: -30, filter: "blur(6px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }

      // canvas/grid container animation
      gsap.fromTo(
        ".stack-canvas-container",
        { opacity: 0, scale: 0.95, filter: "blur(8px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="relative flex flex-col gap-10 overflow-hidden px-6 py-24 md:gap-16 md:px-10 md:py-32 text-[#E9E6DF]">
      {/* slow-drifting background glow, matches the language used in About */}
      <div
        data-stack-glow
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 top-0 -z-10 h-[36rem] w-[36rem] rounded-full opacity-[0.14] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(79,47,240,0.9), transparent 70%)",
          animation: reducedMotion ? "none" : "aurora-drift-b 18s ease-in-out infinite",
        }}
      />

      {/* Big bold "Stack" header — single clean heading, char-by-char reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-current/10 pb-6 md:pb-10"
      >
        <CharReveal
          text="Stack"
          tag="h2"
          stagger={0.04}
          className="font-display text-6xl font-extrabold uppercase tracking-tight sm:text-8xl md:text-[10rem] text-[#E9E6DF] leading-none"
        />
      </motion.div>

      <div className="flex w-full max-w-7xl flex-col gap-8 md:flex-row md:gap-10 items-center justify-center mx-auto">
        <div
          ref={railRef}
          className="flex w-full flex-row flex-wrap gap-5 justify-center md:justify-start md:w-[24%] md:flex-col md:gap-7 z-10"
        >
          {categories.map((cat) => (
            <CategoryButton
              key={cat}
              cat={cat}
              active={activeCategory === cat}
              onEnter={() => setActiveCategory(cat)}
              onLeave={() => setActiveCategory(null)}
            />
          ))}
        </div>

        <div className="stack-canvas-container relative flex-1 overflow-hidden rounded-none w-full h-[60vh] md:h-[75vh]">
          {use3D ? (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] text-[#E9E6DF]/50">
                  Loading scene…
                </div>
              }
            >
              <StackScene activeCategory={activeCategory} onHoverLogo={setHoveredLogo} inView={inView} />
              <StackHUD item={hoveredLogo} />
            </Suspense>
          ) : (
            <div className="flex h-full items-center overflow-y-auto px-4 py-10 md:px-8">
              <StackGrid2D activeCategory={activeCategory} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


