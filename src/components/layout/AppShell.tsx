"use client";

import { Cursor } from "@/components/ui/Cursor";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { Grain } from "./Grain";
import { ScrollProgress } from "./ScrollProgress";

export function AppShell({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  useLenis(!reducedMotion);

  return (
    <>
      <Grain />
      <ScrollProgress />
      <Cursor />
      {children}
    </>
  );
}
