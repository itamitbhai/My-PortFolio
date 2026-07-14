@AGENTS.md

This is Amit Kumar's portfolio site. The full design/build spec lives in the
conversation that started this project (design system, section-by-section
animation spec, build order). Key facts:

- Next.js 16 (App Router, TS strict), Tailwind v4 CSS-first tokens in
  `src/app/globals.css`, `motion/react` for component motion, GSAP +
  ScrollTrigger for scroll-driven motion, Lenis for smooth scroll.
- `src/lib/fonts.ts` uses Google Fonts stand-ins (Space Grotesk, Manrope) for
  Clash Display / Satoshi until the real Fontshare files are supplied.
- All copy/content is data-driven from `src/content/*` — never hardcode copy
  in components.
- GSAP owns anything tied to scroll position; `motion/react` owns anything
  tied to component state/presence. Never animate the same property with both.
