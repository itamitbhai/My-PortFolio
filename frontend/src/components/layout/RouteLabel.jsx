export function RouteLabel({ label, className = "text-slate" }) {
  return (
    <div className={`sticky top-20 left-0 z-[50] w-fit font-mono text-[11px] uppercase tracking-[0.12em] md:top-24 ${className}`}>
      {label}
    </div>
  );
}
