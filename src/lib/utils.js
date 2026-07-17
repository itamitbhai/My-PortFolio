import { gsap } from "./gsap";

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function spawnRipple(event, color = "rgba(255,255,255,0.45)") {
  const button = event.currentTarget;
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const span = document.createElement("span");

  span.style.position = "absolute";
  span.style.left = `${event.clientX - rect.left - size / 2}px`;
  span.style.top = `${event.clientY - rect.top - size / 2}px`;
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.borderRadius = "9999px";
  span.style.background = color;
  span.style.pointerEvents = "none";
  span.style.zIndex = "0";
  span.style.transform = "scale(0)";
  span.style.opacity = "0.55";

  button.appendChild(span);

  gsap.to(span, {
    scale: 1,
    opacity: 0,
    duration: 0.65,
    ease: "power2.out",
    onComplete: () => span.remove(),
  });
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}
