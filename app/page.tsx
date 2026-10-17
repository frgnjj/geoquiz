import Link from "next/link";
import Image from "next/image";
import { COUNTRIES } from "@/data/countries";

const MODES = [
  {
    href: "/flags",
    title: "Flags",
    description: "See a flag, name the country.",
    preview: (
      <Image
        src="/flags/jp.svg"
        alt=""
        width={64}
        height={48}
        unoptimized
        className="rounded-sm border border-line"
      />
    ),
  },
  {
    href: "/capitals",
    title: "Capitals",
    description: "See a country, name its capital.",
    preview: <span className="text-2xl font-medium text-muted">Tokyo</span>,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-8 pb-24">
      <h1 className="text-5xl font-semibold tracking-tight">How well do you know the world?</h1>
      <p className="mt-4 text-lg text-muted">
        {COUNTRIES.length} countries. Pick a quiz.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-6">
        {MODES.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="group flex flex-col justify-between gap-12 rounded-2xl border border-line bg-surface p-8 transition-colors hover:border-foreground"
          >
            <div className="flex h-12 items-center">{mode.preview}</div>
            <div>
              <h2 className="text-2xl font-semibold">{mode.title}</h2>
              <p className="mt-1 text-muted">{mode.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
