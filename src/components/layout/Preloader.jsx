import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function Preloader() {
  const alreadyVisited = useRef(sessionStorage.getItem("preloaded") === "1").current;
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!alreadyVisited);
  const [display, setDisplay] = useState(0);
  const [fontsReady, setFontsReady] = useState(false);
  const panelRef = useRef(null);
  const { progress: threeProgress } = useProgress();
  const displayRef = useRef(0);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    if (!visible) return;

    const target = fontsReady ? 100 : Math.min(threeProgress, 92);
    const obj = { val: displayRef.current };

    const tween = gsap.to(obj, {
      val: target,
      duration: reducedMotion ? 0 : 0.5,
      ease: "power1.out",
      onUpdate: () => {
        displayRef.current = obj.val;
        setDisplay(Math.round(obj.val));
      },
    });

    return () => tween.kill();
  }, [fontsReady, threeProgress, visible, reducedMotion]);

  useEffect(() => {
    if (!visible || display < 100) return;

    sessionStorage.setItem("preloaded", "1");

    if (reducedMotion) {
      setVisible(false);
      return;
    }

    const timeout = setTimeout(() => {
      gsap.to(panelRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "expo.inOut",
        onComplete: () => setVisible(false),
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [display, visible, reducedMotion]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-bone p-6 md:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      role="status"
      aria-label="Loading site"
    >
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink">
          {String(display).padStart(3, "0")} / 100
        </span>
        <div className="h-px w-full bg-ink/10">
          <div
            className="h-full bg-uv"
            style={{ width: `${display}%`, transition: "width 0.1s linear" }}
          />
        </div>
      </div>
    </div>
  );
}
