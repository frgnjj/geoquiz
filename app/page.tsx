import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { COUNTRIES, type Country } from "@/data/countries";
import { displayAnswer } from "@/lib/answers";
import { CapitolIcon } from "@/components/icons";
import RememberPair from "@/components/RememberPair";
import { PAIR_COOKIE } from "@/lib/homePair";

type Pair = { flag: Country; capital: Country };

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-8 pb-24">
      <h1 className="text-5xl font-semibold tracking-tight">How well do you know the world?</h1>
      <p className="mt-4 text-lg text-muted">
        {COUNTRIES.length} countries. Pick a quiz.
      </p>
      <Suspense fallback={<ModeCards />}>
        <RandomModeCards />
      </Suspense>
    </main>
  );
}

/** Shows a new flag and capital on every load, each from a different country. */
async function RandomModeCards() {
  const last = (await cookies()).get(PAIR_COOKIE)?.value.split(".") ?? [];
  const pair = randomPair(last);
  return (
    <>
      <ModeCards pair={pair} />
      <RememberPair value={`${pair.flag.code}.${pair.capital.code}`} />
    </>
  );
}

/** Picks two different countries, avoiding the ones shown on the previous load. */
function randomPair(exclude: string[]): Pair {
  const pick = (skip: string[]) => {
    const options = COUNTRIES.filter((c) => !skip.includes(c.code));
    return options[Math.floor(Math.random() * options.length)];
  };
  const flag = pick(exclude);
  const capital = pick([...exclude, flag.code]);
  return { flag, capital };
}

function ModeCards({ pair }: { pair?: Pair }) {
  const modes = [
    {
      href: "/flags",
      title: "Flags",
      description: "See a flag, name the country.",
      // While the random pick streams in, a blank flag-sized box holds its place.
      preview: pair ? (
        <Image
          src={`/flags/${pair.flag.code}.svg`}
          alt=""
          width={64}
          height={48}
          unoptimized
          className="rounded-sm border border-line"
        />
      ) : (
        <div className="h-12 w-16 rounded-sm bg-line" />
      ),
    },
    {
      href: "/capitals",
      title: "Capitals",
      description: "See a country, name its capital.",
      preview: (
        <span className="flex items-center gap-3 text-2xl font-medium text-muted">
          <CapitolIcon className="size-7 shrink-0" />
          {pair ? displayAnswer(pair.capital, "capitals") : <span className="h-6 w-28 rounded bg-line" />}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-12 grid grid-cols-2 gap-6">
      {modes.map((mode) => (
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
  );
}
