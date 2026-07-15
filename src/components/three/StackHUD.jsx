import { useEffect, useState } from "react";

export function StackHUD({ item }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!item) {
      setDisplay("");
      return undefined;
    }

    const full = `${item.name} — ${item.note}`;
    let i = 0;
    setDisplay("");

    const id = setInterval(() => {
      i += 1;
      setDisplay(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 18);

    return () => clearInterval(id);
  }, [item]);

  if (!item) return null;

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-[70%] font-mono text-[11px] uppercase tracking-[0.12em] text-[#E9E6DF] md:bottom-6 md:left-6">
      {display}
      <span className="pulse-dot">_</span>
    </div>
  );
}
