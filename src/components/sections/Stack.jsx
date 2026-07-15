import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { categories } from "../../content/stack";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import { hasWebGL } from "../../lib/utils";
import { RouteLabel } from "../layout/RouteLabel";
import { StackGrid2D } from "../three/StackGrid2D";
import { StackHUD } from "../three/StackHUD";

const StackScene = lazy(() =>
  import("../three/StackScene").then((mod) => ({ default: mod.StackScene }))
);

export function Stack() {
  const sectionRef = useRef(null);
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="relative min-h-[220vh] text-[#E9E6DF]">
      <div className="sticky top-0 flex h-screen flex-col gap-6 overflow-hidden px-6 pb-8 pt-24 md:flex-row md:px-10 md:pb-10 md:pt-28">
        <RouteLabel label="/stack" className="text-[#E9E6DF]/60" />

        <div className="flex w-full flex-row flex-wrap gap-4 pt-10 md:w-[26%] md:flex-col md:gap-6 md:pt-16">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              className="w-fit font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{ color: activeCategory === cat ? "#4F2FF0" : "rgba(233,230,223,0.6)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
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
            <div className="flex h-full items-center overflow-y-auto py-10">
              <StackGrid2D activeCategory={activeCategory} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
