import { useEffect, useRef } from "react";

import { site } from "../../content/site";
import { gsap } from "../../lib/gsap";
import { RouteLabel } from "../layout/RouteLabel";

export function About() {
  const sectionRef = useRef(null);
  const paraRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = paraRef.current.querySelectorAll("span[data-word]");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: paraRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: true,
          },
        })
        .to(words, {
          color: () => getComputedStyle(document.documentElement).getPropertyValue("--fg").trim(),
          stagger: 0.05,
        });

      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 1,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = site.about.split(" ");

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col gap-12 px-6 py-24 md:flex-row md:gap-16 md:px-10 md:py-32"
    >
      <RouteLabel label="/about" />

      <div className="flex flex-1 flex-col gap-8 md:pt-16">
        <p ref={paraRef} className="max-w-[62ch] font-body text-xl leading-relaxed md:text-2xl">
          {words.map((word, i) => (
            <span key={i} data-word className="text-slate" style={{ marginRight: "0.3em" }}>
              {word}
            </span>
          ))}
        </p>
      </div>

      <div
        ref={imageWrapRef}
        className="relative isolate h-[28rem] w-full overflow-hidden md:h-[32rem] md:w-80 md:pt-0"
      >
        <img
          ref={imageRef}
          src={site.portrait}
          alt={`Portrait of ${site.name}`}
          className="h-full w-full scale-[1.2] object-cover grayscale contrast-[1.08]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-uv/[0.18] mix-blend-color" />
      </div>
    </section>
  );
}
