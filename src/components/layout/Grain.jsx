export function Grain() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[998] h-full w-full opacity-[0.04] mix-blend-overlay"
      aria-hidden="true"
    >
      <filter id="grain-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  );
}
