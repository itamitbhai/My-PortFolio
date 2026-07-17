import { AuroraDivider } from "./dividers/AuroraDivider";
import { BeamDivider } from "./dividers/BeamDivider";
import { GlowLineDivider } from "./dividers/GlowLineDivider";
import { ParticlesDivider } from "./dividers/ParticlesDivider";
import { WaveDivider } from "./dividers/WaveDivider";

const VARIANTS = {
  glow: GlowLineDivider,
  wave: WaveDivider,
  particles: ParticlesDivider,
  aurora: AuroraDivider,
  beam: BeamDivider,
};

/** Cinematic transition band dropped between sections. Each `variant` is a distinct animation. */
export function SectionDivider({ variant = "glow" }) {
  const Variant = VARIANTS[variant] ?? GlowLineDivider;
  return <Variant />;
}
