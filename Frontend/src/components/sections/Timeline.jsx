import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import { timeline } from "../../content/timeline";
import { gsap } from "../../lib/gsap";
import { RouteLabel } from "../layout/RouteLabel";

export function Timeline() {
  const sectionRef = useRef(null);
  const roleRefs = useRef([]);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      roleRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)", filter: "blur(6px)" },
          {
            clipPath: "inset(0 0 0% 0)",
            filter: "blur(0px)",
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="relative bg-ink px-6 py-24 text-bone md:px-10 md:py-32">
      <RouteLabel label="/timeline" className="text-slate-inverse" />

      <div className="relative mt-12 grid grid-cols-[64px_1fr] gap-6 md:grid-cols-[140px_1fr] md:gap-12">
        <svg className="pointer-events-none absolute left-[31px] top-0 h-full w-px md:left-[69px]" aria-hidden="true">
          <line x1="0" y1="0" x2="0" y2="100%" stroke="currentColor" strokeOpacity="0.15" />
          <motion.line
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
            stroke="#4F2FF0"
            strokeWidth="2"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>

        <motion.div
          className="pulse-dot pointer-events-none absolute left-[27px] h-2 w-2 rounded-full bg-amber md:left-[65px]"
          style={{ top: dotTop }}
          aria-hidden="true"
        />

        {timeline.map((entry, i) => (
          <div key={entry.year} className="contents">
            <div className="sticky top-24 h-fit font-mono text-[11px] uppercase tracking-[0.12em] text-slate-inverse">
              {entry.year}
            </div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-2 pb-20"
            >
              <h3
                ref={(el) => {
                  roleRefs.current[i] = el;
                }}
                className="font-display text-2xl tracking-[-0.02em] md:text-3xl"
              >
                {entry.role}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-uv transition-[text-shadow] duration-300 hover:[text-shadow:0_0_14px_rgba(79,47,240,0.6)]">
                {entry.org}
              </span>
              <p className="max-w-[55ch] text-bone/70">{entry.body}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
