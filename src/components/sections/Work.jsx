import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { projects } from "../../content/projects";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useCursor } from "../../store/useCursor";
import { CharReveal } from "../ui/CharReveal";
import { RouteLabel } from "../layout/RouteLabel";

const projectDetails = {
  vyapar: {
    category: "Full-Stack Engineering"
  },
  pulse: {
    category: "Real-Time Engineering"
  },
  orbit: {
    category: "DevOps & Cloud Engineering"
  },
  quill: {
    category: "Product & Desktop Development"
  }
};

function getDetails(project) {
  return projectDetails[project.slug] || { category: "Frontend Engineering" };
}

function ProjectRow({ project, setCursor, resetCursor }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const details = getDetails(project);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="project-row flex flex-col gap-6"
    >
      {/* mobile-only ghost index — the sticky column handles this on md+ */}
      <span className="font-display font-extrabold text-[4rem] leading-none text-white/10 select-none md:hidden">
        {project.index}.
      </span>

      <div
        onMouseEnter={() => {
          setHovered(true);
          setCursor("hover");
        }}
        onMouseLeave={() => {
          setHovered(false);
          resetCursor();
        }}
        onMouseMove={handleMouseMove}
        onClick={() => window.open(project.link, "_blank")}
        className="relative w-full aspect-video overflow-hidden rounded-xl bg-white/5 cursor-pointer group"
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.05]"
        />

        {hovered && (
          <div
            className="pointer-events-none absolute z-20 flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-md text-[#E9E6DF] text-xs uppercase tracking-wide select-none shadow-lg"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none"
            }}
          >
            <svg
              className="w-3.5 h-3.5 rotate-45 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="font-mono font-medium lowercase text-white/90">view</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-white/40 tracking-widest uppercase font-mono select-none">
            {details.category}
          </span>
          <h3 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight select-none">
            {project.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 items-center sm:justify-end">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="border border-white/10 rounded-full px-3.5 py-1 text-[11px] font-medium tracking-wide text-white/60 bg-white/[0.02] select-none"
            >
              {tech}
            </span>
          ))}
          <span className="bg-white/90 text-[#0F1115] rounded-full px-3.5 py-1 text-[11px] font-bold select-none shadow-sm">
            {project.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Work() {
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const numberRef = useRef(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const total = projects.length;
    const numberEl = numberRef.current;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".project-row");
      if (!numberEl || rows.length === 0) return;

      // rolls the sticky index digit up/down, odometer-style: slide the
      // current value out, swap the text, slide the new value in
      const roll = (nextIndex, direction) => {
        const outY = direction === 1 ? -100 : 100;
        const inY = direction === 1 ? 100 : -100;
        gsap.to(numberEl, {
          yPercent: outY,
          duration: 0.45,
          ease: "power4.inOut",
          onComplete: () => {
            activeIndexRef.current = nextIndex;
            numberEl.textContent = `${projects[nextIndex].index}.`;
            gsap.fromTo(numberEl, { yPercent: inY }, { yPercent: 0, duration: 0.45, ease: "power2.out" });
          }
        });
      };

      rows.forEach((row, i) => {
        gsap.timeline({ defaults: { duration: 0.7 } }).to(row, {
          scrollTrigger: {
            trigger: row,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 0.01,
            onLeaveBack: () => {
              if (activeIndexRef.current !== 0) roll(i - 1, -1);
            }
          },
          ease: "power1.inOut",
          onComplete: () => {
            if (activeIndexRef.current !== total - 1) roll(i + 1, 1);
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="work" ref={sectionRef} className="relative w-full bg-[#0d0d0d] text-[#E9E6DF] py-16 md:py-24">
      {/* Big bold "Work" header — identical treatment to the Stack heading */}
      <div className="w-full border-b border-white/10 px-6 pb-6 md:px-10 md:pb-10">
        <RouteLabel label="/work" className="mb-6 text-white/50 md:mb-8" />
        <CharReveal
          text="Work"
          tag="h2"
          stagger={0.04}
          className="font-display text-6xl font-extrabold uppercase leading-none tracking-tight text-[#E9E6DF] sm:text-8xl md:text-[10rem]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-x-10 md:grid-cols-12">
          {/* sticky rolling index — stays in place while the project list scrolls past */}
          <div className="relative hidden md:col-span-4 md:block lg:col-span-3">
            <div className="sticky top-[38vh] overflow-hidden">
              <span
                ref={numberRef}
                className="block font-display font-extrabold text-[6rem] leading-none text-[#E9E6DF] lg:text-[8rem]"
                style={{ willChange: "transform" }}
              >
                {projects[0].index}.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-20 md:col-span-8 md:gap-28 lg:col-span-9">
            {projects.map((project) => (
              <ProjectRow key={project.slug} project={project} setCursor={setCursor} resetCursor={resetCursor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
