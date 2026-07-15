import Lenis from "lenis";

let instance = null;

export function createLenis() {
  if (!instance) {
    instance = new Lenis({ lerp: 0.1, smoothWheel: true });
  }
  return instance;
}

export function getLenis() {
  return instance;
}

export function destroyLenis() {
  instance?.destroy();
  instance = null;
}
