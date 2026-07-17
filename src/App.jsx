import { AmbientBackground } from "./components/layout/AmbientBackground";
import { Cursor } from "./components/layout/Cursor";
import { Footer } from "./components/layout/Footer";
import { Grain } from "./components/layout/Grain";
import { Nav } from "./components/layout/Nav";
import { Preloader } from "./components/layout/Preloader";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Hero } from "./components/sections/Hero";
import { Stack } from "./components/sections/Stack";
import { Timeline } from "./components/sections/Timeline";
import { Work } from "./components/sections/Work";
import { Marquee } from "./components/ui/Marquee";
import { SectionDivider } from "./components/ui/SectionDivider";
import { useLenis } from "./hooks/useLenis";
import { useReducedMotion } from "./hooks/useReducedMotion";

function App() {
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);

  return (
    <>
      <Preloader />
      <AmbientBackground />
      <Grain />
      <ScrollProgress />
      <Cursor />
      <Nav />

      <main id="main" className="relative">
        <Hero />
        <SectionDivider variant="beam" />
        <Marquee />
        <About />
        <SectionDivider variant="glow" />
        <Stack />
        <SectionDivider variant="particles" />
        <Work />
        <SectionDivider variant="wave" />
        <Timeline />
        <SectionDivider variant="aurora" />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;
