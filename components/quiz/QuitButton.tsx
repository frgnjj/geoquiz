"use client";

import { useEffect, useRef, useState } from "react";

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
        className={open ? "text-foreground" : "hover:text-foreground"}
      >
        ← Quit
      </button>
      {open && (
        <button
          type="button"
          onClick={onConfirm}
          autoFocus
          className="absolute left-0 top-full z-10 mt-2 rounded-lg border border-line bg-surface px-4 py-2 font-medium text-wrong shadow-sm transition-colors hover:border-wrong"
        >
          Confirm
        </button>
      )}
    </span>
  );
}
