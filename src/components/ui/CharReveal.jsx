import { useEffect, useRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";

/**
 * Splits `text` into per-character spans and reveals them with a blurred
 * y + fade stagger, driven by ScrollTrigger. Word grouping is preserved so
 * text still wraps naturally.
 */
export function CharReveal({
  text,
  className = "",
  tag: Tag = "span",
  stagger = 0.02,
  start = "top 85%",
  duration = 0.7,
}) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return undefined;
    const chars = ref.current.querySelectorAll("[data-char]");

    if (reducedMotion) {
      gsap.set(chars, { opacity: 1, yPercent: 0, filter: "blur(0px)" });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(chars, { opacity: 0, yPercent: 100, filter: "blur(8px)" });
      gsap.to(chars, {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        duration,
        ease: "expo.out",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: "play none none none",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, stagger, start, duration]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
          style={{ marginRight: "0.25em" }}
        >
          {word.split("").map((ch, ci) => (
            <span key={ci} data-char className="inline-block will-change-transform">
              {ch}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
