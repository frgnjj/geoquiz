"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon } from "@/components/icons";

/** Quit opens a small Confirm button below it, so one stray click doesn't end the game. */
export default function QuitButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // A click anywhere else, or Esc, closes it.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-line/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-foreground ${
          open ? "bg-line/60 text-foreground" : "text-muted"
        }`}
      >
        <ArrowLeftIcon className="size-4" />
        Quit
      </button>
      {open && (
        <button
          type="button"
          onClick={onConfirm}
          autoFocus
          className="absolute left-0 top-full z-10 mt-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-sm font-medium text-wrong shadow-lifted transition-colors hover:border-wrong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wrong"
        >
          Confirm
        </button>
      )}
    </span>
  );
}
