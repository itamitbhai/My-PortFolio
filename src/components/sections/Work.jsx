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

// Non-cinematic fallback for phones and reduced-motion users — a plain
// vertical stack, no scroll-jacking.
function SimpleProjectCard({ project, setCursor, resetCursor }) {
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
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 py-12 md:py-20 border-b border-white/5 items-start"
    >
      <div className="lg:col-span-4 flex items-start select-none">
        <span className="font-display font-extrabold text-[7rem] md:text-[10rem] lg:text-[14rem] leading-none text-white/5 transition-colors duration-500">
          {project.index}.
        </span>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6">
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
          className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-white/5 cursor-pointer group shadow-xl"
        >
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.05]"
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

        <div className="flex flex-col gap-2">
          <span className="text-xs md:text-sm text-white/40 tracking-widest uppercase font-mono text-left select-none">
            {details.category}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white tracking-tight text-left select-none">
              {project.name}
            </h3>

            <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end">
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
        </div>
      </div>
    </motion.div>
  );
}

export function Work() {
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);
  const reducedMotion = useReducedMotion();

  const [isTabletUp, setIsTabletUp] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handleChange = (e) => setIsTabletUp(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // desktop/tablet get the pinned cinematic slideshow; phones and
  // prefers-reduced-motion get the plain scrolling stack above
  const cinematic = isTabletUp && !reducedMotion;

  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const cardRefs = useRef([]);
  const imgRefs = useRef([]);
  const numberRef = useRef(null);
  const titleRef = useRef(null);
  const metaRef = useRef(null);

  useEffect(() => {
    if (!cinematic) return undefined;

    const total = projects.length;
    const cards = cardRefs.current;
    const imgs = imgRefs.current;
    if (cards.length !== total || cards.some((c) => !c)) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(cards[0], { y: 0, scale: 1, opacity: 1, rotationX: 0, pointerEvents: "auto" });
      gsap.set(imgs[0], { scale: 1 });
      for (let i = 1; i < total; i += 1) {
        gsap.set(cards[i], {
          y: 120,
          scale: 0.95,
          opacity: 0,
          rotationX: 2,
          pointerEvents: "none",
          transformOrigin: "50% 100%"
        });
        gsap.set(imgs[i], { scale: 1.08 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapRef.current,
          start: "top top",
          end: () => `+=${(total - 1) * window.innerHeight}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (total - 1),
            duration: { min: 0.25, max: 0.6 },
            ease: "power1.inOut"
          }
        }
      });

      for (let i = 1; i < total; i += 1) {
        const pos = i - 1;
        const prevCard = cards[i - 1];
        const nextCard = cards[i];
        const nextImg = imgs[i];
        const nextProject = projects[i];
        const nextDetails = getDetails(nextProject);

        tl.to(prevCard, { scale: 0.92, opacity: 0.6, y: -60, duration: 1.1, ease: "power4.inOut" }, pos)
          .to(nextCard, { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 1.1, ease: "power4.inOut" }, pos)
          .to(nextImg, { scale: 1, duration: 1.1, ease: "power4.inOut" }, pos)
          .set(prevCard, { pointerEvents: "none" }, pos)
          .set(nextCard, { pointerEvents: "auto" }, pos + 1)
          .to(
            numberRef.current,
            {
              opacity: 0,
              duration: 0.35,
              ease: "power2.in",
              onComplete: () => {
                numberRef.current.textContent = nextProject.index;
              }
            },
            pos + 0.3
          )
          .to(numberRef.current, { opacity: 1, duration: 0.35, ease: "power2.out" }, pos + 0.55)
          .to(
            titleRef.current,
            {
              opacity: 0,
              filter: "blur(10px)",
              duration: 0.35,
              ease: "power2.in",
              onComplete: () => {
                titleRef.current.textContent = nextProject.name;
              }
            },
            pos + 0.3
          )
          .to(titleRef.current, { opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out" }, pos + 0.55)
          .to(
            metaRef.current,
            {
              opacity: 0,
              duration: 0.3,
              onComplete: () => {
                metaRef.current.textContent = `${nextDetails.category} — ${nextProject.year}`;
              }
            },
            pos + 0.3
          )
          .to(metaRef.current, { opacity: 1, duration: 0.3 }, pos + 0.55);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [cinematic]);

  const firstDetails = getDetails(projects[0]);

  return (
    <section id="work" ref={sectionRef} className="relative w-full bg-[#0d0d0d] text-[#E9E6DF]">
      {/* Big bold "Work" header — identical treatment to the Stack heading */}
      <div className="w-full border-b border-white/10 px-6 pb-6 pt-16 md:px-10 md:pb-10 md:pt-24">
        <RouteLabel label="/work" className="mb-6 text-white/50 md:mb-8" />
        <CharReveal
          text="Work"
          tag="h2"
          stagger={0.04}
          className="font-display text-6xl font-extrabold uppercase leading-none tracking-tight text-[#E9E6DF] sm:text-8xl md:text-[10rem]"
        />
      </div>

      {cinematic ? (
        <div ref={pinWrapRef} className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            {/* HUD column — fixed index number + title, updates in place as slides advance */}
            <div className="pointer-events-none z-40 flex w-[32%] max-w-[22rem] flex-shrink-0 select-none flex-col justify-center pl-6 lg:w-[30%] lg:pl-14">
              <span
                ref={numberRef}
                className="block font-display text-[3.25rem] font-extrabold leading-none text-white/20 lg:text-[7rem]"
                style={{ willChange: "opacity" }}
              >
                {projects[0].index}
              </span>
              <h3
                ref={titleRef}
                className="mt-3 font-display text-xl font-bold text-white lg:mt-6 lg:text-4xl"
                style={{ willChange: "opacity, filter" }}
              >
                {projects[0].name}
              </h3>
              <p
                ref={metaRef}
                className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40"
                style={{ willChange: "opacity" }}
              >
                {firstDetails.category} — {projects[0].year}
              </p>
            </div>

            {/* Stacked cinematic slides — separate column so they never fight the HUD for space */}
            <div className="relative h-full flex-1" style={{ perspective: "1400px" }}>
              {projects.map((project, i) => (
                <div
                  key={project.slug}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  onMouseEnter={() => setCursor("hover")}
                  onMouseLeave={resetCursor}
                  onClick={() => window.open(project.link, "_blank")}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center pr-6 lg:pr-14"
                  style={{ zIndex: i + 1, willChange: "transform, opacity" }}
                >
                  <div className="relative h-[68%] w-[92%] overflow-hidden rounded-2xl shadow-2xl lg:h-[76%] lg:w-[86%]">
                    <img
                      ref={(el) => {
                        imgRefs.current[i] = el;
                      }}
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover"
                      style={{ willChange: "transform" }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-7xl flex-col px-6 py-12 md:px-10 md:py-16">
          {projects.map((project) => (
            <SimpleProjectCard
              key={project.slug}
              project={project}
              setCursor={setCursor}
              resetCursor={resetCursor}
            />
          ))}
        </div>
      )}
    </section>
  );
}
