import { create } from "zustand";

export const useCursor = create((set) => ({
  state: "default",
  label: null,
  setState: (state, label) => set({ state, label: label ?? null }),
  reset: () => set({ state: "default", label: null }),
}));
