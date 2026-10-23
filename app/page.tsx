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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 pt-6 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-0 lg:pb-24">
      <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
        How well do you know the world?
      </h1>
      <p className="mt-4 text-lg text-muted lg:mt-5">
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
          className="h-24 w-32 rounded-md shadow-flag ring-1 ring-line transition-transform lg:h-36 lg:w-48 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:-translate-y-1"
        />
      ) : (
        <div className="h-24 w-32 rounded-md bg-line lg:h-36 lg:w-48" />
      ),
    },
    {
      href: "/capitals",
      title: "Capitals",
      description: "See a country, name its capital.",
      preview: (
        <span className="flex items-start gap-3 text-3xl leading-[1.1] font-semibold tracking-tight text-balance lg:gap-4 lg:text-4xl">
          <CapitolIcon className="mt-0.5 size-7 shrink-0 text-muted lg:size-9" />
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
    <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14 lg:gap-6">
      {modes.map((mode) => (
        <Link
          key={mode.href}
          href={mode.href}
          className="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors active:border-foreground lg:p-10 hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <Globe className="pointer-events-none absolute -top-24 -right-32 -z-10 size-[22rem] rotate-[-23.4deg] text-line transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:rotate-[-8deg]" />
          <div className="flex h-24 items-center lg:h-36">{mode.preview}</div>
          <div className="mt-8 flex items-end justify-between gap-6 lg:mt-12">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">{mode.title}</h2>
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
