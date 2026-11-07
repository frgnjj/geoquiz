"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The quiz pages keep the screen to the game (and phones have Start pinned to the bottom there).
const HIDDEN_ON = ["/flags", "/capitals", "/maps"];

export default function Footer() {
  const pathname = usePathname();
  if (HIDDEN_ON.includes(pathname)) return null;

  return (
    <footer className="mx-auto flex w-full max-w-5xl px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
      <Link
        href="/privacy"
        className="rounded text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        Privacy
      </Link>
    </footer>
  );
}
