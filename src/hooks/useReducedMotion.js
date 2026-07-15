import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = (e) => setReduced(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
