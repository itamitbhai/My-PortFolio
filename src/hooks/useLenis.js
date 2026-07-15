import { useEffect } from "react";

import { gsap, ScrollTrigger } from "../lib/gsap";
import { createLenis, destroyLenis } from "../lib/lenis";

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = createLenis();
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      destroyLenis();
    };
  }, [enabled]);
}
