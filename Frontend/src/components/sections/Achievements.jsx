import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import {
  PiBriefcaseFill,
  PiCodeBold,
  PiCrownSimpleFill,
  PiTrophyFill,
} from "react-icons/pi";

import { achievements } from "../../content/achievements";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap, useGSAP } from "../../lib/gsap";
import { CharReveal } from "../ui/CharReveal";
import { TiltCard } from "../ui/TiltCard";

const ICONS = {
  trophy: PiTrophyFill,
  crown: PiCrownSimpleFill,
  briefcase: PiBriefcaseFill,
  code: PiCodeBold,
};

const ACCENTS = ["#FFAE35", "#4F2FF0", "#FFAE35", "#4F2FF0"];

function FeaturedCard({ item, index, setCardRef, setNumberRef }) {
  const Icon = ICONS[item.icon] ?? PiTrophyFill;

  return (
    <div ref={setCardRef} className="achievement-card">
      <TiltCard
        max={3}
        className="glass-panel glow-border group relative isolate flex flex-col gap-8 overflow-hidden p-8 md:flex-row md:items-center md:gap-12 md:p-12"
      >
        <span
          ref={setNumberRef}
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[8rem] font-extrabold leading-none text-current/[0.05] md:-top-14 md:text-[11rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative flex shrink-0 flex-col items-start gap-4 md:items-center">
          <div
            className="relative flex h-20 w-20 items-center justify-center rounded-full text-3xl text-[#0F1115] shadow-[0_0_40px_-8px_rgba(255,174,53,0.7)] transition-transform duration-500 group-hover:scale-105 md:h-24 md:w-24 md:text-4xl"
            style={{ background: "linear-gradient(140deg, #FFAE35, #ffd08a)" }}
          >
            <Icon />
          </div>
          <span className="whitespace-nowrap rounded-full border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
            ★ Featured
          </span>
        </div>

        <div className="relative flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-uv">
            <span>{item.org}</span>
            <span aria-hidden="true" className="text-current/30">·</span>
            <span>{item.year}</span>
          </div>
          <h3 className="font-display text-3xl tracking-[-0.02em] md:text-5xl">{item.title}</h3>
          <p className="max-w-[56ch] text-slate">{item.body}</p>

          {item.metric && (
            <div className="mt-2 flex w-fit items-baseline gap-2 border-l-2 border-amber pl-4">
              <span className="font-display text-2xl font-extrabold leading-none text-ink">{item.metric}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-slate">{item.metricLabel}</span>
            </div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}

function AchievementCard({ item, index, accent, setCardRef, setNumberRef }) {
  const Icon = ICONS[item.icon] ?? PiCodeBold;

  return (
    <div ref={setCardRef} className="achievement-card">
      <TiltCard
        max={6}
        className="glass-panel glow-border group relative isolate flex h-full flex-col gap-5 overflow-hidden p-6 md:p-7"
      >
        <span
          ref={setNumberRef}
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[5rem] font-extrabold leading-none text-current/[0.06] md:text-[6rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className="relative flex h-12 w-12 items-center justify-center rounded-full text-xl text-[#0F1115] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: `linear-gradient(140deg, ${accent}, ${accent}cc)` }}
        >
          <Icon />
        </div>

        <div className="relative flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-uv">
            <span>{item.org}</span>
            <span aria-hidden="true" className="text-current/30">·</span>
            <span className="text-slate">{item.year}</span>
          </div>
          <h3 className="font-display text-xl tracking-[-0.02em] md:text-2xl">{item.title}</h3>
          <p className="max-w-[42ch] text-sm text-slate">{item.body}</p>
        </div>

        {item.metric && (
          <div className="relative mt-auto flex items-baseline gap-2 border-t border-current/10 pt-4">
            <span className="font-display text-lg font-extrabold leading-none text-ink">{item.metric}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">{item.metricLabel}</span>
          </div>
        )}
      </TiltCard>
    </div>
  );
}

export function Achievements() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const numberRefs = useRef([]);
  const reducedMotion = useReducedMotion();

  const featured = achievements.find((a) => a.featured) ?? achievements[0];
  const rest = achievements.filter((a) => a !== featured);

  const yearRange = useMemo(() => {
    const years = achievements.map((a) => Number(a.year)).filter(Boolean);
    if (!years.length) return "";
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? `${min}` : `${min}–${max}`;
  }, []);

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-1/3 -z-10 h-[26rem] w-[26rem] rounded-full opacity-[0.08] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(79,47,240,0.85), transparent 70%)",
          animation: reducedMotion ? "none" : "aurora-drift-a 22s ease-in-out infinite",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full flex-col gap-4 border-b border-current/10 pb-6 md:flex-row md:items-end md:justify-between md:pb-10"
      >
        <CharReveal
          text="Achievements"
          tag="h2"
          stagger={0.03}
          className="font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl md:text-[7rem] text-ink leading-none"
        />
        <div className="flex shrink-0 gap-6 font-mono text-[11px] uppercase tracking-[0.12em] text-slate md:flex-col md:items-end md:gap-2 md:pb-3">
          <span>
            <span className="text-ink">{String(achievements.length).padStart(2, "0")}</span> Milestones
          </span>
          <span>{yearRange}</span>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 md:gap-8">
        <FeaturedCard
          item={featured}
          index={0}
          setCardRef={(el) => {
            cardRefs.current[0] = el;
          }}
          setNumberRef={(el) => {
            numberRefs.current[0] = el;
          }}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {rest.map((item, i) => (
            <AchievementCard
              key={item.title}
              item={item}
              index={i + 1}
              accent={ACCENTS[(i + 1) % ACCENTS.length]}
              setCardRef={(el) => {
                cardRefs.current[i + 1] = el;
              }}
              setNumberRef={(el) => {
                numberRefs.current[i + 1] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
