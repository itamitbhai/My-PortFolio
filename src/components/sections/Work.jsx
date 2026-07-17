import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { projects } from "../../content/projects";
import { useIsMobile } from "../../hooks/useIsMobile";
import { gsap } from "../../lib/gsap";
import { useCursor } from "../../store/useCursor";
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

function Card({ project, imgRef, contentRef, onSelect }) {
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  return (
    <div className="relative flex h-full w-full shrink-0 flex-col justify-end gap-4 px-6 pb-32 pt-16 md:w-screen md:px-16 md:pb-40">
      <TiltCard max={4} className="absolute inset-6 md:inset-16">
        <button
          type="button"
          onClick={() => onSelect(project)}
          onMouseEnter={() => setCursor("view", "View")}
          onMouseLeave={resetCursor}
          className="block h-full w-full overflow-hidden"
        >
          <motion.img
            ref={imgRef}
            layoutId={`project-image-${project.slug}`}
            src={project.image}
            alt={project.name}
            className="h-full w-full scale-[1.15] object-cover"
          />
        </button>
      </TiltCard>

      <div ref={contentRef} className="flex flex-col gap-4">
        <div className="relative flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone">
          <span>/{project.index}</span>
        </div>
        <h3 className="relative font-display text-4xl leading-[0.95] tracking-[-0.03em] text-bone md:text-6xl">
          {project.name}
        </h3>
        <div className="relative flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone/70">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <p className="relative max-w-[50ch] text-bone/80">{project.problem}</p>
      </div>
    </div>
  );
}

export function Work() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const imageRefs = useRef([]);
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
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getTotalScroll()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(trackRef.current, { x: () => -getTotalScroll(), duration: totalDuration, ease: "none" }, 0);

      imageRefs.current.forEach((img) => {
        if (img) tl.to(img, { xPercent: -10, duration: totalDuration, ease: "none" }, 0);
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
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section id="work" ref={sectionRef} className="relative bg-ink text-bone">
      <div className="absolute left-6 top-20 z-10 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-inverse md:left-10 md:top-24">
        /work
      </div>

      {isMobile ? (
        <div className="flex flex-col gap-24 px-6 py-16">
          {projects.map((project) => (
            <div key={project.slug} className="relative h-[70vh]">
              <Card project={project} imgRef={() => {}} onSelect={setSelected} />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-screen overflow-hidden">
          <div ref={trackRef} className="flex h-full w-max">
            {projects.map((project, i) => (
              <Card
                key={project.slug}
                project={project}
                imgRef={(el) => {
                  imageRefs.current[i] = el;
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
