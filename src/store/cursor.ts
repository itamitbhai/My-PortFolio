import { create } from "zustand";

export type CursorState = "default" | "hover" | "drag" | "view" | "text";

interface CursorStore {
  state: CursorState;
  label: string | null;
  setState: (state: CursorState, label?: string) => void;
  reset: () => void;
}

export const useCursorStore = create<CursorStore>((set) => ({
  state: "default",
  label: null,
  setState: (state, label) => set({ state, label: label ?? null }),
  reset: () => set({ state: "default", label: null }),
}));
