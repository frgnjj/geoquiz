import { Fragment, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { COUNTRIES, type Country } from "@/data/countries";
import { ArrowRightIcon, CapitolIcon } from "@/components/icons";
import RememberPair from "@/components/RememberPair";
import { PAIR_COOKIE } from "@/lib/homePair";

type Pair = { flag: Country; capital: Country };

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-8 pb-24">
      <h1 className="max-w-4xl text-7xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
        How well do you know the world?
      </h1>
      <p className="mt-5 text-lg text-muted">
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
  await connection(); // pick at request time, not while prerendering
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
          width={192}
          height={144}
          unoptimized
          className="rounded-md shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_24px_-6px_rgb(0_0_0/0.18)] ring-1 ring-line transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:-translate-y-1"
        />
      ) : (
        <div className="h-36 w-48 rounded-md bg-line" />
      ),
    },
    {
      href: "/capitals",
      title: "Capitals",
      description: "See a country, name its capital.",
      preview: (
        <span className="flex items-start gap-4 text-4xl leading-[1.1] font-semibold tracking-tight text-balance">
          <CapitolIcon className="mt-0.5 size-9 shrink-0 text-muted" />
          {pair ? (
            // Let long multi-capital names wrap after a slash.
            pair.capital.capitals.map((city, i) => (
              <Fragment key={city}>
                {i > 0 && "/"}
                {i > 0 && <wbr />}
                {city}
              </Fragment>
            ))
          ) : (
            <span className="h-10 w-48 rounded bg-line" />
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="mt-14 grid grid-cols-2 gap-6">
      {modes.map((mode) => (
        <Link
          key={mode.href}
          href={mode.href}
          className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-10 transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Globe className="pointer-events-none absolute -top-24 -right-32 -z-10 size-[22rem] rotate-[-23.4deg] text-line transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:rotate-[-8deg]" />
          <div className="flex h-36 items-center">{mode.preview}</div>
          <div className="mt-12 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">{mode.title}</h2>
              <p className="mt-1.5 text-muted">{mode.description}</p>
            </div>
            <ArrowRightIcon className="size-6 shrink-0 text-muted transition duration-300 ease-out group-hover:text-foreground motion-safe:group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}

/** A faint line globe behind each card, drawn like the logo, tilted like the Earth's axis. */
function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      <g strokeWidth={0.5}>
        <circle cx="100" cy="100" r="96" />
        <ellipse cx="100" cy="100" rx="32" ry="96" />
        <ellipse cx="100" cy="100" rx="64" ry="96" />
        <path d="M100 4v192M4 100h192M16.9 52h166.2M16.9 148h166.2M36.5 28h127M36.5 172h127" />
      </g>
    </svg>
  );
}
