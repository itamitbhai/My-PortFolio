import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { projects } from "../../content/projects";
import { useIsMobile } from "../../hooks/useIsMobile";
import { gsap } from "../../lib/gsap";
import { spawnRipple } from "../../lib/utils";
import { useCursor } from "../../store/useCursor";
import { RouteLabel } from "../layout/RouteLabel";
import { CharReveal } from "../ui/CharReveal";
import { TiltCard } from "../ui/TiltCard";

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-ink/90 p-6 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex max-h-full w-full max-w-4xl flex-col gap-6 overflow-y-auto bg-bone p-6 text-ink md:flex-row md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          layoutId={`project-image-${project.slug}`}
          src={project.image}
          alt={project.name}
          className="h-64 w-full object-cover md:h-auto md:w-1/2"
        />
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
            <span>/{project.index}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="font-display text-4xl leading-[0.95] tracking-[-0.03em]">{project.name}</h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-uv">{project.problem}</p>
          <p className="max-w-[60ch] text-slate">{project.body}</p>
          <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
            {project.stack.map((tech) => (
              <span key={tech} className="border border-current/10 px-2 py-1">
                {tech}
              </span>
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate">{project.role}</span>
          <button
            type="button"
            onClick={onClose}
            className="mt-auto w-fit border border-current/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-bone"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Card({ project, imgWrapRef, contentRef, onSelect }) {
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  return (
    <div className="relative flex h-full w-full shrink-0 flex-col justify-end gap-6 px-6 pb-28 pt-16 md:w-screen md:gap-8 md:px-16 md:pb-36">
      <motion.div
        className="glow-border absolute inset-6 md:inset-16"
        initial={false}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        style={{
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))",
        }}
      >
        <TiltCard max={5} className="h-full w-full">
          <div className="group relative h-full w-full overflow-hidden border border-bone/15 bg-bone/5">
            <button
              type="button"
              onClick={() => onSelect(project)}
              onMouseEnter={() => setCursor("view", "View project")}
              onMouseLeave={resetCursor}
              className="relative block h-full w-full overflow-hidden"
            >
              {/* GSAP-owned parallax layer — xPercent only, never touched by CSS/hover transforms */}
              <div ref={imgWrapRef} className="absolute inset-0 h-full w-full">
                <motion.img
                  layoutId={`project-image-${project.slug}`}
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full scale-[1.08] object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.2]"
                />
              </div>

              {/* legibility scrim + hover-brighten gradient glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-55" />
              <div className="pointer-events-none absolute inset-0 bg-uv/0 transition-colors duration-500 group-hover:bg-uv/[0.08]" />
            </button>

            {/* premium framing */}
            <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 h-3.5 w-3.5 border-l border-t border-bone/50" />
            <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-10 h-3.5 w-3.5 border-r border-t border-bone/50" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-10 h-3.5 w-3.5 border-b border-l border-bone/50" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 z-10 h-3.5 w-3.5 border-b border-r border-bone/50" />
          </div>
        </TiltCard>
      </motion.div>

      <div ref={contentRef} className="relative z-10 flex flex-col gap-4 md:max-w-2xl">
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bone/60">
          <span className="text-uv">/{project.index}</span>
          <span className="h-px w-8 bg-current/30" />
          <span>{project.year}</span>
        </div>

        <h3 className="font-display text-4xl leading-[0.95] tracking-[-0.03em] text-bone md:text-7xl">
          {project.name}
        </h3>

        <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/70">
          {project.stack.map((tech) => (
            <span key={tech} className="border border-bone/15 px-2.5 py-1">
              {tech}
            </span>
          ))}
        </div>

        <p className="max-w-[50ch] text-bone/80">{project.problem}</p>

        <button
          type="button"
          onClick={(e) => {
            spawnRipple(e, "rgba(233,230,223,0.35)");
            onSelect(project);
          }}
          onMouseEnter={() => setCursor("hover")}
          onMouseLeave={resetCursor}
          className="btn-shine group/btn relative mt-2 flex w-fit items-center gap-3 overflow-hidden border border-bone/25 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-bone transition-colors duration-300 hover:border-uv hover:bg-uv"
        >
          View case study
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

export function Work() {
  const sectionRef = useRef(null);
  const trackWrapRef = useRef(null);
  const trackRef = useRef(null);
  const imageWrapRefs = useRef([]);
  const contentRefs = useRef([]);
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (isMobile) return undefined;

    const ctx = gsap.context(() => {
      const getTotalScroll = () => (projects.length - 1) * window.innerWidth;
      const segment = 1;
      const totalDuration = Math.max(projects.length - 1, 1) * segment;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackWrapRef.current,
          start: "top top",
          end: () => `+=${getTotalScroll()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(trackRef.current, { x: () => -getTotalScroll(), duration: totalDuration, ease: "none" }, 0);

      imageWrapRefs.current.forEach((img) => {
        if (img) tl.to(img, { xPercent: -12, duration: totalDuration, ease: "none" }, 0);
      });

      // each card's copy overlaps in — scales and lifts as it becomes the centered card
      contentRefs.current.forEach((el, i) => {
        if (!el) return;
        const center = i * segment;
        tl.fromTo(
          el,
          { yPercent: 26, opacity: 0.3, scale: 0.94 },
          { yPercent: 0, opacity: 1, scale: 1, duration: segment * 0.8, ease: "none" },
          Math.max(center - segment * 0.45, 0)
        );
        if (i < projects.length - 1) {
          tl.to(
            el,
            { yPercent: -18, opacity: 0.3, duration: segment * 0.45, ease: "none" },
            center + segment * 0.55
          );
        }
      });

      // cinematic blur reveal on each image as its card centers — `filter` is a
      // separate property from the xPercent parallax above, so nothing fights
      // for `transform`.
      imageWrapRefs.current.forEach((img, i) => {
        if (!img || i === 0) return;
        const center = i * segment;
        tl.fromTo(
          img,
          { filter: "blur(10px) brightness(0.6)" },
          { filter: "blur(0px) brightness(1)", duration: segment * 0.5, ease: "power2.out" },
          Math.max(center - segment * 0.5, 0)
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section id="work" ref={sectionRef} className="relative overflow-hidden bg-ink text-bone">
      {/* soft depth glow, echoes the language used in About / Stack */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-1/3 -z-10 h-[34rem] w-[34rem] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(79,47,240,0.9), transparent 70%)",
          animation: "aurora-drift-a 20s ease-in-out infinite",
        }}
      />

      {/* Big bold "Work" header — identical treatment to the About heading */}
      <div className="w-full border-b border-bone/10 px-6 pb-6 pt-24 md:px-10 md:pb-10 md:pt-32">
        <RouteLabel label="/work" className="mb-6 text-bone/50 md:mb-8" />
        <CharReveal
          text="Work"
          tag="h2"
          stagger={0.04}
          className="font-display text-6xl font-extrabold uppercase leading-none tracking-tight text-bone sm:text-8xl md:text-[10rem]"
        />
      </div>

      {isMobile ? (
        <div className="flex flex-col gap-24 px-6 py-16">
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[70vh]"
            >
              <Card project={project} imgWrapRef={() => {}} contentRef={() => {}} onSelect={setSelected} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div ref={trackWrapRef} className="h-screen overflow-hidden">
          <div ref={trackRef} className="flex h-full w-max">
            {projects.map((project, i) => (
              <Card
                key={project.slug}
                project={project}
                imgWrapRef={(el) => {
                  imageWrapRefs.current[i] = el;
                }}
                contentRef={(el) => {
                  contentRefs.current[i] = el;
                }}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
