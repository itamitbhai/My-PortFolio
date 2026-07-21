import { useRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap, useGSAP } from "../../lib/gsap";
import { projects } from "./data";

const TEXT = "#E9E6DF";
const MUTED = "rgba(233,230,223,0.55)";
const HAIRLINE = "rgba(233,230,223,0.18)";

function ArrowIcon() {
  return (
    <svg
      className="ml-2 h-[10px] w-[10px] flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  );
}

function MaskedHeading({ text, className, style }) {
  const words = text.split(" ");
  return (
    <span className={className} style={style} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" style={{ marginRight: "0.2em" }}>
          {word.split("").map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden align-top" aria-hidden="true">
              <span data-work-char className="inline-block will-change-transform">
                {ch}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function Work() {
  const reducedMotion = useReducedMotion();

  const rootRef = useRef(null);
  const headingRef = useRef(null);
  const rowRefs = useRef([]);
  const imgWrapRefs = useRef([]);
  const imgRefs = useRef([]);
  const textColRefs = useRef([]);
  const titleRefs = useRef([]);
  const underlineRefs = useRef([]);
  const pillsRefs = useRef([]);

  useGSAP(
    () => {
      const underlines = underlineRefs.current.filter(Boolean);
      gsap.set(underlines, { scaleX: 0, transformOrigin: "left center" });

      if (reducedMotion) {
        gsap.set(imgRefs.current.filter(Boolean), { scale: 1.15, yPercent: 0 });
        gsap.set([...imgWrapRefs.current, ...textColRefs.current].filter(Boolean), {
          opacity: 1,
          y: 0
        });
        const chars = headingRef.current?.querySelectorAll("[data-work-char]");
        if (chars) gsap.set(chars, { yPercent: 0 });
        return;
      }

      // header: mask-reveal each character of "Selected Work"
      const chars = headingRef.current.querySelectorAll("[data-work-char]");
      gsap.set(chars, { yPercent: 100 });
      gsap.to(chars, {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.02,
        scrollTrigger: { trigger: headingRef.current, start: "top 80%" }
      });

      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const imgWrap = imgWrapRefs.current[i];
        const img = imgRefs.current[i];
        const textCol = textColRefs.current[i];
        const pills = (pillsRefs.current[i] || []).filter(Boolean);

        gsap.set(img, { scale: 1.15 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 78%", toggleActions: "play none none reverse" }
        });
        tl.fromTo(
          [imgWrap, textCol],
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 }
        );
        if (pills.length) {
          tl.from(pills, { opacity: 0, y: 10, duration: 0.5, stagger: 0.05, ease: "power2.out" }, "-=0.3");
        }

        // continuous parallax drift on the image itself, independent of hover
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true }
          }
        );
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  const handleEnter = (i) => {
    if (reducedMotion) return;
    gsap.to(imgWrapRefs.current[i], { scale: 1.04, duration: 0.6, ease: "power2.out" });
    gsap.to(titleRefs.current[i], { x: 8, duration: 0.6, ease: "power2.out" });
    gsap.to(underlineRefs.current[i], { scaleX: 1, duration: 0.4, ease: "power2.out" });
  };

  const handleLeave = (i) => {
    if (reducedMotion) return;
    gsap.to(imgWrapRefs.current[i], { scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(titleRefs.current[i], { x: 0, duration: 0.6, ease: "power2.out" });
    gsap.to(underlineRefs.current[i], { scaleX: 0, duration: 0.4, ease: "power2.out" });
  };

  return (
    <section id="work" ref={rootRef} className="w-full" style={{ minHeight: "100vh" }}>
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32 lg:py-40">
        {/* header */}
        <div className="mb-24 md:mb-32 lg:mb-48">
          <div style={{ borderTop: `1px solid ${HAIRLINE}` }} />
          <p
            className="mt-6 text-[11px] uppercase"
            style={{ color: MUTED, letterSpacing: "0.2em" }}
          >
            02 / WORK
          </p>
          <h2 ref={headingRef} className="mt-4">
            <MaskedHeading
              text="SELECTED WORK"
              className="font-display block font-extrabold uppercase leading-[0.95] tracking-tight text-[clamp(2.5rem,12vw,5rem)] lg:text-[clamp(4rem,11vw,10rem)]"
              style={{ color: TEXT }}
            />
          </h2>
        </div>

        {/* rows */}
        <div className="flex flex-col gap-24 lg:gap-[180px]">
          {projects.map((project, i) => {
            const isOdd = i % 2 === 0; // 1st, 3rd project (0-indexed even i)
            pillsRefs.current[i] = [];

            return (
              <article
                key={project.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
                className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-20"
              >
                <a
                  href={project.href}
                  ref={(el) => {
                    imgWrapRefs.current[i] = el;
                  }}
                  className={`relative block aspect-[4/3] overflow-hidden rounded-[14px] ${
                    isOdd ? "lg:order-1 lg:col-span-6 lg:col-start-1" : "lg:order-2 lg:col-span-6 lg:col-start-7"
                  }`}
                  aria-label={`View ${project.title} project`}
                >
                  <img
                    ref={(el) => {
                      imgRefs.current[i] = el;
                    }}
                    src={project.image}
                    alt={`${project.title} project preview`}
                    className="h-full w-full object-cover will-change-transform"
                  />
                </a>

                <div
                  ref={(el) => {
                    textColRefs.current[i] = el;
                  }}
                  className={`flex flex-col gap-6 ${
                    isOdd ? "lg:order-2 lg:col-span-5 lg:col-start-8" : "lg:order-1 lg:col-span-5 lg:col-start-1"
                  }`}
                >
                  <h3
                    ref={(el) => {
                      titleRefs.current[i] = el;
                    }}
                    className="font-display font-bold uppercase leading-none tracking-tight"
                    style={{ color: TEXT, fontSize: "clamp(2.5rem, 4.5vw, 4rem)" }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="max-w-[46ch] text-[16px] leading-[1.6] md:text-[17px]"
                    style={{ color: MUTED }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-[10px]">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        ref={(el) => {
                          pillsRefs.current[i][ti] = el;
                        }}
                        className="rounded-full bg-transparent px-[18px] py-[7px] text-[12px] uppercase"
                        style={{ border: `1px solid ${HAIRLINE}`, color: TEXT, letterSpacing: "0.06em" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.href}
                    className="inline-flex w-fit items-center text-[13px] uppercase"
                    style={{ color: TEXT, letterSpacing: "0.12em" }}
                  >
                    <span className="relative inline-block pb-[6px]">
                      View Project
                      <span
                        ref={(el) => {
                          underlineRefs.current[i] = el;
                        }}
                        className="absolute bottom-0 left-0 h-px w-full"
                        style={{ background: TEXT }}
                        aria-hidden="true"
                      />
                    </span>
                    <ArrowIcon />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
