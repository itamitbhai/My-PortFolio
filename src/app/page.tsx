"use client";

import { useCursorStore } from "@/store/cursor";
import { site } from "@/content/site";

export default function Home() {
  const setState = useCursorStore((s) => s.setState);
  const reset = useCursorStore((s) => s.reset);

  return (
    <main className="flex flex-col">
      <section className="flex min-h-screen flex-col justify-between p-6 md:p-10">
        <div className="flex items-center justify-between font-mono text-mono uppercase tracking-[0.12em] text-slate">
          <span>/index</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            available — phase 1
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-mono text-mono uppercase tracking-[0.12em] text-slate">
            {site.role} — {site.location}
          </p>
          <h1 className="font-display text-display leading-[0.9] tracking-[-0.03em]">
            {site.name}
          </h1>
          <p className="max-w-[38ch] text-sub text-slate">{site.tagline}</p>

          <button
            type="button"
            onPointerEnter={() => setState("hover")}
            onPointerLeave={reset}
            className="mt-4 w-fit border-hairline border px-6 py-3 font-mono text-mono uppercase tracking-[0.12em]"
          >
            Systems check
          </button>
        </div>

        <div className="font-mono text-mono uppercase tracking-[0.12em] text-slate">
          scroll ↓
        </div>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center gap-8 border-hairline border-t p-6 md:p-10">
        <div
          onPointerEnter={() => setState("view", "View")}
          onPointerLeave={reset}
          className="flex h-64 w-full max-w-md items-center justify-center border-hairline border font-mono text-mono uppercase tracking-[0.12em] text-slate"
        >
          hover — view state
        </div>
        <div
          onPointerEnter={() => setState("drag", "Drag")}
          onPointerLeave={reset}
          className="flex h-64 w-full max-w-md items-center justify-center border-hairline border font-mono text-mono uppercase tracking-[0.12em] text-slate"
        >
          hover — drag state
        </div>
      </section>
    </main>
  );
}
