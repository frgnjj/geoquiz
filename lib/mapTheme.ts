"use client";

import { useSyncExternalStore } from "react";

/** The Maps mode map themes. "auto" follows the site's light or dark mode. */
export type MapTheme = "auto" | "light" | "dark" | "grey-light" | "grey-dark" | "blue";

/** Each theme with its name and swatch colours (sea, land) for the picker. */
export const MAP_THEMES: { id: MapTheme; label: string; sea: string; land: string }[] = [
  { id: "auto", label: "Auto", sea: "", land: "" },
  { id: "light", label: "Light", sea: "#eee9de", land: "#fbf9f3" },
  { id: "dark", label: "Dark", sea: "#0c0c0e", land: "#27272a" },
  { id: "grey-light", label: "Grey light", sea: "#f3f1ec", land: "#c8c4bc" },
  { id: "grey-dark", label: "Grey dark", sea: "#0e0e10", land: "#47474e" },
  { id: "blue", label: "Blue sea", sea: "#cfe3ef", land: "#c6c3bc" },
];

// The choice is remembered on this device; it's a preference, so losing it is harmless.
const KEY = "map-theme";
const listeners = new Set<() => void>();

function read(): MapTheme {
  try {
    const saved = localStorage.getItem(KEY);
    return MAP_THEMES.some((t) => t.id === saved) ? (saved as MapTheme) : "auto";
  } catch {
    return "auto";
  }
}

export function setMapTheme(theme: MapTheme) {
  try {
    if (theme === "auto") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, theme);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function useMapTheme(): MapTheme {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    read,
    () => "auto",
  );
}
