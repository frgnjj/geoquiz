import { useSyncExternalStore } from "react";

// Whether a quiz is being played right now, so the header title can stop linking home.
let active = false;
const listeners = new Set<() => void>();

export function setQuizActive(value: boolean) {
  active = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useQuizActive() {
  return useSyncExternalStore(subscribe, () => active, () => false);
}
