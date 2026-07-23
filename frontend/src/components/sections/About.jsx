import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { site } from "../../content/site";
import { gsap } from "../../lib/gsap";
import { useCursor } from "../../store/useCursor";
import { CharReveal } from "../ui/CharReveal";
import { TiltCard } from "../ui/TiltCard";

function PortraitFrame() {
  const wrapRef = useRef(null);
  const imageRef = useRef(null);
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-sm md:mx-0"
    >
      {/* continuously floating decorative frames */}
      <span
        aria-hidden="true"
        className="float-y-sm pointer-events-none absolute -inset-3 -z-10 border border-current/10 md:-inset-4"
      />
      <span
        aria-hidden="true"
        className="float-y pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full border border-uv/40 md:-bottom-5 md:-right-5"
      />
      <span
        aria-hidden="true"
        className="spin-slow pointer-events-none absolute -right-6 -top-6 -z-10 h-14 w-14 rounded-full border border-dashed border-uv/30 md:-right-8 md:-top-8"
      />

      <TiltCard max={6}>
        <div
          ref={wrapRef}
          onMouseEnter={() => setCursor("card")}
          onMouseLeave={resetCursor}
          className="group relative isolate aspect-[4/5] w-full overflow-hidden border border-current/15 bg-current/5"
        >
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 h-3 w-3 border-l border-t border-current/40" />
          <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-3 w-3 border-r border-t border-current/40" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-10 h-3 w-3 border-b border-l border-current/40" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-10 h-3 w-3 border-b border-r border-current/40" />

          <img
            ref={imageRef}
            src={site.portrait}
            alt={`Portrait of ${site.name}`}
            className="h-full w-full scale-[1.2] object-cover grayscale contrast-[1.08] transition-[filter] duration-700 ease-out group-hover:grayscale-0"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-uv/[0.18] mix-blend-color transition-opacity duration-700 group-hover:opacity-0"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-current/10 bg-bone/80 px-3 py-2.5 backdrop-blur-sm">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{site.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate">{site.role}</span>
          </div>
        </div>
      </TiltCard>

      <div className="absolute -left-3 -top-3 origin-top-left scale-90 md:-left-4 md:-top-4">
        <div className="flex items-center gap-2 border border-current/10 bg-bone/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink backdrop-blur-sm">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber" />
          Available for work
        </div>
      </div>
    </motion.div>
  );
}

export function About() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current.querySelectorAll("span[data-word]");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        })
        .to(words, {
          "--reveal": 1,
          stagger: 0.05,
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { about } = site;
  const headlineWords = about.headline.split(" ");

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col gap-10 overflow-hidden px-6 py-24 md:gap-16 md:px-10 md:py-32"
    >
      {/* slow-drifting background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-1/4 -z-10 h-[32rem] w-[32rem] rounded-full opacity-[0.1] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(79,47,240,0.8), transparent 70%)",
          animation: "aurora-drift-a 16s ease-in-out infinite",
        }}
      />

      {/* Big bold "About" header — single clean heading, char-by-char reveal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full border-b border-current/10 pb-6 md:pb-10"
      >
        <CharReveal
          text="About"
          tag="h2"
          stagger={0.04}
          className="font-display text-6xl font-extrabold uppercase tracking-tight sm:text-8xl md:text-[10rem] text-ink leading-none"
        />
      </motion.div>

      {/* Content Container */}
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* Left Column - Text Content */}
        <div className="order-2 flex flex-1 flex-col gap-10 md:order-1 md:pt-8">
          <p
            ref={headlineRef}
            className="max-w-2xl font-display text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl"
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                data-word
                className="inline-block"
                style={{
                  marginRight: "0.22em",
                  color:
                    "color-mix(in srgb, var(--scroll-fg, var(--fg)) calc(var(--reveal, 0) * 100%), rgb(var(--slate)) calc((1 - var(--reveal, 0)) * 100%))",
                }}
              >
                {word}
              </span>
            ))}
          </p>

          <div className="flex max-w-[60ch] flex-col gap-5">
            {about.paragraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="font-body text-lg leading-relaxed text-slate md:text-xl"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
            className="flex flex-wrap gap-2"
          >
            {about.highlights.map((item) => (
              <motion.span
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="border border-current/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 hover:border-uv/40 hover:text-uv hover:shadow-[0_0_20px_rgba(79,47,240,0.25)]"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Portrait Image */}
        <div className="order-1 flex w-full items-start md:order-2 md:w-80 md:shrink-0 md:pt-24">
          <PortraitFrame />
        </div>
      </div>
    </section>
  );
}
