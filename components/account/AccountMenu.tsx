"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useAccount } from "@/lib/account";
import { useQuizActive } from "@/lib/quizActive";

/** Header corner: "Sign in" for guests, or a round initial that opens the account menu. */
export default function AccountMenu() {
  const account = useAccount();
  const playing = useQuizActive();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  // Hidden mid-game, like the home link, so only Quit leaves a game.
  if (playing) return null;
  // Same size as the button, so the header doesn't shift once the account loads.
  if (account.status === "loading") return <span className="size-9" aria-hidden="true" />;

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-line/60 hover:text-foreground";

  if (account.status === "signed-out") {
    if (pathname === "/signin") return null;
    return (
      <Link href={`/signin?next=${encodeURIComponent(pathname)}`} className={linkClass}>
        Sign in
      </Link>
    );
  }

  if (!account.username) {
    if (pathname === "/welcome") return null;
    return (
      <Link href={`/welcome?next=${encodeURIComponent(pathname)}`} className={linkClass}>
        Pick a username
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Account: ${account.username}`}
        className={`flex size-9 items-center justify-center rounded-full border text-sm font-semibold uppercase transition-colors hover:border-foreground ${
          open ? "border-foreground bg-surface" : "border-line bg-surface"
        }`}
      >
        {account.username[0]}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-60 rounded-xl border border-line bg-surface p-2 shadow-lifted">
          <div className="px-3 py-2">
            <p className="truncate font-semibold">{account.username}</p>
            {account.email && <p className="truncate text-sm text-muted">{account.email}</p>}
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href={`/u/${encodeURIComponent(account.username)}`}
            onClick={() => setOpen(false)}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-line/60"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-line/60"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
