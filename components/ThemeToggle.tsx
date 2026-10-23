"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./icons";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");
const systemDark = () => matchMedia("(prefers-color-scheme: dark)").matches;

function savedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  // The phone's status bar follows the page, including a theme picked with this toggle.
  useEffect(() => {
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", dark ? "#0c0c0e" : "#fafafa"));
  }, [dark]);

  // With no saved choice, the site follows the system theme, even when it changes later.
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (!savedTheme()) document.documentElement.classList.toggle("dark", query.matches);
    };
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      // Picking the system's own theme goes back to following the system.
      if (next === systemDark()) localStorage.removeItem("theme");
      else localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full p-2 text-muted transition-colors hover:bg-line/60 hover:text-foreground"
    >
      {/* The icon shows the mode you're in now. */}
      <SunIcon className="size-5 dark:hidden" />
      <MoonIcon className="hidden size-5 dark:block" />
    </button>
  );
}
