import { useEffect, useState } from "react";

function formatIST(date) {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  return formatter.format(date);
}

export function StatusPill() {
  const [time, setTime] = useState(() => formatIST(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatIST(new Date())), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 border border-current/10 bg-bone/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink backdrop-blur-sm">
      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber" />
      <span className="hidden sm:inline">Available — {time} IST</span>
      <span className="sm:hidden">{time}</span>
    </div>
  );
}
