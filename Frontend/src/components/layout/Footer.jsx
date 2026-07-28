import { useEffect, useRef, useState } from "react";
import { PiArrowUpRightBold, PiEnvelopeSimpleBold, PiGithubLogoBold, PiLinkedinLogoBold, PiXLogoBold } from "react-icons/pi";

import { site } from "../../content/site";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { gsap } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";
import { useCursor } from "../../store/useCursor";
import { Magnetic } from "../ui/Magnetic";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#work", label: "Work" },
  { href: "#timeline", label: "Timeline" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

const SOCIALS = [
  { key: "github", href: site.socials.github, label: "GitHub", Icon: PiGithubLogoBold },
  { key: "linkedin", href: site.socials.linkedin, label: "LinkedIn", Icon: PiLinkedinLogoBold },
  { key: "x", href: site.socials.x, label: "X", Icon: PiXLogoBold },
  { key: "email", href: `mailto:${site.email}`, label: "Email", Icon: PiEnvelopeSimpleBold },
];

function formatLocalTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function FooterMarquee() {
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return undefined;

    const baseSpeed = 0.7;
    let rafId;

    const loop = () => {
      const lenis = getLenis();
      const velocity = Math.max(-40, Math.min(40, lenis?.velocity ?? 0));
      const speed = baseSpeed + velocity * 0.5;

      xRef.current -= speed;

      const width = track.scrollWidth / 2;
      if (width > 0) {
        xRef.current = (((xRef.current % width) + width) % width) - width;
      }

      gsap.set(track, { x: xRef.current });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const words = [site.name.toUpperCase(), "AVAILABLE FOR WORK"];
  const items = [...words, ...words, ...words, ...words];

  return (
    <div className="overflow-hidden border-y border-ink/10 py-7 md:py-10">
      <div ref={trackRef} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform md:gap-16">
        {items.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-4xl uppercase leading-none tracking-tight text-ink md:gap-16 md:text-7xl"
          >
            {word}
            <span className="text-2xl text-uv md:text-4xl" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const [time, setTime] = useState(() => formatLocalTime(new Date()));
  const year = new Date().getFullYear();
  const setCursor = useCursor((s) => s.setState);
  const resetCursor = useCursor((s) => s.reset);

  useEffect(() => {
    const id = setInterval(() => setTime(formatLocalTime(new Date())), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const scrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative border-t border-ink/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between md:py-20">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
              Have a project in mind?
            </span>
            <a
              href={`mailto:${site.email}`}
              onMouseEnter={() => setCursor("hover")}
              onMouseLeave={resetCursor}
              className="group inline-flex w-fit items-center gap-4 font-display text-[clamp(1.6rem,5vw,3.5rem)] font-extrabold leading-none tracking-tight text-ink transition-colors hover:text-uv"
            >
              {site.email}
              <PiArrowUpRightBold
                className="h-6 w-6 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 md:h-9 md:w-9"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {SOCIALS.map(({ key, href, label, Icon }) => (
              <Magnetic key={key} radius={60} strength={0.3}>
                <a
                  href={href}
                  target={key === "email" ? undefined : "_blank"}
                  rel={key === "email" ? undefined : "noreferrer"}
                  onMouseEnter={() => setCursor("hover")}
                  onMouseLeave={resetCursor}
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-slate transition-colors hover:text-ink"
                >
                  <Icon className="h-4 w-4 transition-colors group-hover:text-uv" aria-hidden="true" />
                  <span className="link-underline">{label}</span>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>
      </div>

      <FooterMarquee />

      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setCursor("link")}
                onMouseLeave={resetCursor}
                className="link-underline transition-colors hover:text-uv"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-slate">
            <span>Local time — {time}</span>
            <span>Built with React · R3F · GSAP</span>
            <span>&copy; {year} {site.name}</span>
            <button
              type="button"
              onClick={scrollToTop}
              onMouseEnter={() => setCursor("hover")}
              onMouseLeave={resetCursor}
              className="flex w-fit items-center gap-1.5 transition-colors hover:text-uv"
            >
              Back to top
              <PiArrowUpRightBold className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
