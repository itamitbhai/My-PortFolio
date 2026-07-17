import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { categories } from "../../content/stack";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import { hasWebGL } from "../../lib/utils";
import { useCursor } from "../../store/useCursor";
import { RouteLabel } from "../layout/RouteLabel";
import { StackGrid2D } from "../three/StackGrid2D";
import { StackHUD } from "../three/StackHUD";
import { CharReveal } from "../ui/CharReveal";

const StackScene = lazy(() =>
  import("../three/StackScene").then((mod) => ({ default: mod.StackScene }))
);

function CategoryButton({ cat, active, onEnter, onLeave }) {
  const ref = useRef(null);
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: dx * 0.25, y: dy * 0.3, duration: 0.4, ease: "power2.out", overwrite: true });
  };

  const handleLeave = () => {
    onLeave();
    resetCursor();
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", overwrite: true });
  };

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
      className="relative w-fit font-mono text-[13px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 md:text-[15px]"
      style={{ color: active ? "#4F2FF0" : "rgba(233,230,223,0.55)" }}
    >
      <span
        className="pointer-events-none absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-uv transition-transform duration-300"
        style={{ transform: `translateY(-50%) scale(${active ? 1 : 0})` }}
        aria-hidden="true"
      />
      {cat}
      <span
        className="pointer-events-none absolute -bottom-1.5 left-0 h-px bg-uv transition-all duration-300 ease-out"
        style={{ width: active ? "100%" : "0%" }}
        aria-hidden="true"
      />
    </button>
  );
}

export function Stack() {
  const sectionRef = useRef(null);
  const headingWrapRef = useRef(null);
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
      gsap.to(document.documentElement, {
        "--scroll-bg": "#0F1115",
        "--scroll-fg": "#E9E6DF",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        },
      });

      // slow parallax drift on the background glow
      gsap.to("[data-stack-glow]", {
        yPercent: 18,
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
          { opacity: 0, y: 20, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.07,
            ease: "expo.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none none" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="relative min-h-[260vh] text-[#E9E6DF]">
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

      {/* Big bold "Stack" header — identical treatment to the About heading */}
      <div
        ref={headingWrapRef}
        className="w-full border-b border-current/10 px-6 pb-6 pt-24 md:px-10 md:pb-10 md:pt-32"
      >
        <RouteLabel label="/stack" className="mb-6 text-[#E9E6DF]/60 md:mb-8" />
        <CharReveal
          text="Stack"
          tag="h2"
          stagger={0.04}
          className="font-display text-6xl font-extrabold uppercase leading-none tracking-tight text-[#E9E6DF] sm:text-8xl md:text-[10rem]"
        />
      </div>

      <div className="sticky top-0 flex h-screen flex-col gap-8 overflow-hidden px-6 pb-10 pt-10 md:flex-row md:gap-10 md:px-10 md:pb-14 md:pt-14">
        <div
          ref={railRef}
          className="glass-panel flex w-full flex-row flex-wrap gap-5 rounded-none p-5 md:w-[24%] md:flex-col md:gap-7 md:p-7"
        >
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#E9E6DF]/35 md:block">
            Categories
          </span>
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

        <div className="glass-panel relative flex-1 overflow-hidden rounded-none">
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
