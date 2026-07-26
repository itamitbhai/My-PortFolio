import { motion } from "framer-motion";
import { useRef } from "react";

import { achievements } from "../../content/achievements";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap, useGSAP } from "../../lib/gsap";
import { CharReveal } from "../ui/CharReveal";
import { TiltCard } from "../ui/TiltCard";

function AchievementCard({ item, index, setCardRef, setNumberRef, setImageRef }) {
  return (
    <div ref={setCardRef} className="achievement-card">
      <TiltCard
        max={5}
        className="group relative isolate flex h-full flex-col gap-6 overflow-hidden border border-current/15 bg-current/[0.03] p-6 sm:flex-row sm:items-start md:p-8"
      >
        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-current/40" />
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-current/40" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-current/40" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-current/40" />

        <span
          ref={setNumberRef}
          aria-hidden="true"
          className="pointer-events-none absolute -right-1 -top-5 select-none font-display text-[5.5rem] font-extrabold leading-none text-current/[0.06] md:-top-7 md:text-[7.5rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative aspect-[4/5] w-full max-w-[150px] shrink-0 overflow-hidden border border-current/15 bg-current/5">
          <img
            ref={setImageRef}
            src={item.image}
            alt={`${item.title} — ${item.org}`}
            className="h-full w-full scale-[1.18] object-cover grayscale contrast-[1.08] transition-[filter] duration-700 ease-out group-hover:grayscale-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-uv/[0.18] mix-blend-color transition-opacity duration-700 group-hover:opacity-0"
          />
        </div>

        <div className="relative flex flex-1 flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-uv">
            {item.org} · {item.year}
          </span>
          <h3 className="font-display text-2xl tracking-[-0.02em] md:text-3xl">{item.title}</h3>
          <p className="max-w-[48ch] text-slate">{item.body}</p>
        </div>
      </TiltCard>
    </div>
  );
}

export function Achievements() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const numberRefs = useRef([]);
  const imageRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 70, clipPath: "inset(0 0 100% 0)", filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
          }
        );

        const img = imageRefs.current[i];
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        }

        const numEl = numberRefs.current[i];
        if (numEl) {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: i + 1,
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" },
            onUpdate: () => {
              numEl.textContent = String(Math.round(counter.val)).padStart(2, "0");
            },
          });
        }
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative flex flex-col gap-10 overflow-hidden px-6 py-24 md:gap-16 md:px-10 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-1/4 bottom-0 -z-10 h-[32rem] w-[32rem] rounded-full opacity-[0.1] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255,174,53,0.75), transparent 70%)",
          animation: reducedMotion ? "none" : "aurora-drift-b 20s ease-in-out infinite",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-current/10 pb-6 md:pb-10"
      >
        <CharReveal
          text="Achievements"
          tag="h2"
          stagger={0.03}
          className="font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl md:text-[7rem] text-ink leading-none"
        />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {achievements.map((item, i) => (
          <AchievementCard
            key={item.title}
            item={item}
            index={i}
            setCardRef={(el) => {
              cardRefs.current[i] = el;
            }}
            setNumberRef={(el) => {
              numberRefs.current[i] = el;
            }}
            setImageRef={(el) => {
              imageRefs.current[i] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
