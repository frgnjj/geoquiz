"use client";

import { useState } from "react";
import { CONTINENTS, type Continent } from "@/data/countries";
import { countriesFor } from "@/lib/quiz";
import WorldMap from "./WorldMap";

/** A first look at the map before the game arrives: pick a region, tap a country to see its name. */
export default function MapExplorer() {
  const [continents, setContinents] = useState<Continent[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const countries = countriesFor(continents);
  const name = countries.find((c) => c.code === picked)?.name;

  return (
    <div className="mt-8 flex flex-col gap-4 lg:mt-10">
      <div className="flex flex-wrap gap-2">
        {[{ label: "World", value: [] as Continent[] }, ...CONTINENTS.map((c) => ({ label: c, value: [c] }))].map((r) => {
          const selected = r.value.join() === continents.join();
          return (
            <button
              key={r.label}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setContinents(r.value);
                setPicked(null);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selected ? "border-foreground bg-foreground text-background" : "border-line bg-surface hover:border-foreground"
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
      <WorldMap
        continents={continents}
        region={countries.map((c) => c.code)}
        tones={picked ? { [picked]: "highlight" } : {}}
        onPick={setPicked}
        label="Map of the region. Tap a country to see its name."
      />
      <p className="min-h-8 text-2xl font-semibold tracking-tight" aria-live="polite">
        {name ?? <span className="text-lg font-normal text-muted">Tap a country.</span>}
      </p>
    </div>
  );
}
