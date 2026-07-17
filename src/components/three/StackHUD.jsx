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
    <div className="glass-panel pointer-events-none absolute bottom-4 left-4 z-10 max-w-[75%] rounded-none px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-[#E9E6DF] md:bottom-6 md:left-6 md:px-5 md:py-3.5 md:text-[13px]">
      {display}
      <span className="pulse-dot text-uv">_</span>
    </div>
  );
}
