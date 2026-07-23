import { useEffect, useState } from "react";

function formatLocalTime(date) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function Footer() {
  const [time, setTime] = useState(() => formatLocalTime(new Date()));
  const year = new Date().getFullYear();

  useEffect(() => {
    const id = setInterval(() => setTime(formatLocalTime(new Date())), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="border-t border-current/10 px-6 py-8 md:px-10">
      <div className="flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#6B6F76] md:flex-row md:items-center md:justify-between">
        <span>Local time — {time}</span>
        <span>Built with React · R3F · GSAP</span>
        <span>&copy; {year} Amit Kumar</span>
      </div>
    </footer>
  );
}
