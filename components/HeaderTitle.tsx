"use client";

import Link from "next/link";
import { useQuizActive } from "@/lib/quizActive";
import { LogoMark } from "./icons";

/** The logo and name. It links home, except during a quiz, where only Quit leaves the game. */
export default function HeaderTitle() {
  const playing = useQuizActive();
  const content = (
    <>
      <LogoMark className="size-6" />
      Geoquiz
    </>
  );
  const className = "flex items-center gap-2.5 text-lg font-semibold tracking-tight";

  if (playing) return <span className={className}>{content}</span>;
  return (
    <Link href="/" className={className}>
      {content}
    </Link>
  );
}
