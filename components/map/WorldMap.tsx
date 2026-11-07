"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from "d3-zoom";
import type { Continent } from "@/data/countries";
import { drawMap, loadWorld, MAP_HEIGHT, MAP_WIDTH, viewFor, type WorldData } from "@/lib/map";

/** How a country is drawn. "region" countries can be picked; the rest of the world is background. */
export type CountryTone = "highlight" | "correct" | "wrong";

type Props = {
  /** The game's region; the map fits it and only its countries can be picked. */
  continents: Continent[];
  /** Codes of the countries in the region. */
  region: string[];
  /** Countries drawn in a state: the one asked about, a right answer or a wrong pick. */
  tones?: Record<string, CountryTone>;
  /** When set, region countries can be clicked or tapped. */
  onPick?: (code: string) => void;
  label: string;
};

const MARKER_RADIUS = 5;
const MAX_ZOOM = 12;

const FILL: Record<CountryTone, string> = {
  highlight: "fill-foreground",
  correct: "fill-correct",
  wrong: "fill-wrong",
};

/** The Maps mode map: an atlas page of the region, with zoom, pan and clickable countries. */
export default function WorldMap({ continents, region, tones = {}, onPick, label }: Props) {
  const [world, setWorld] = useState<WorldData | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    loadWorld().then(
      (data) => current && setWorld(data),
      () => current && setFailed(true),
    );
    return () => {
      current = false;
    };
  }, [attempt]);

  const key = continents.join("|");
  const view = useMemo(() => viewFor(continents), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const drawn = useMemo(() => (world ? drawMap(world, view) : null), [world, view]);
  const inRegion = useMemo(() => new Set(region), [region]);

  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Pinch, scroll and drag move one layer; markers stay the same size on screen at any zoom.
  useEffect(() => {
    const svg = svgRef.current;
    const layer = layerRef.current;
    if (!svg || !layer || !drawn) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, MAX_ZOOM])
      .translateExtent([
        [0, 0],
        [MAP_WIDTH, MAP_HEIGHT],
      ])
      .clickDistance(6)
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { x, y, k } = event.transform;
        layer.setAttribute("transform", `translate(${x},${y}) scale(${k})`);
        layer.querySelectorAll<SVGCircleElement>("circle[data-marker]").forEach((c) => {
          c.setAttribute("r", String(MARKER_RADIUS / k));
        });
      });
    zoomRef.current = behavior;
    const selection = select(svg);
    selection.call(behavior).on("dblclick.zoom", null);
    selection.call(behavior.transform, zoomIdentity);
    return () => {
      selection.on(".zoom", null);
    };
  }, [drawn]);

  function zoomBy(factor: number) {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.scaleBy, factor);
  }
  function reset() {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, zoomIdentity);
  }

  return (
    // Sea, then other land, then the region, each a step lighter (light mode) or brighter (dark mode).
    <div className="relative overflow-hidden rounded-2xl border border-line bg-line/40 shadow-sheet dark:bg-background">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="img"
        aria-label={label}
        className="block aspect-[5/3] w-full touch-none select-none"
      >
        <g ref={layerRef}>
          {drawn && (
            <>
              <path d={drawn.land} className="fill-line stroke-muted/30 dark:fill-surface" vectorEffect="non-scaling-stroke" strokeWidth={0.5} />
              {drawn.countries.map((c) => {
                const tone = tones[c.code];
                const pickable = Boolean(onPick) && inRegion.has(c.code);
                const fill = tone
                  ? FILL[tone]
                  : inRegion.has(c.code)
                    ? "fill-surface dark:fill-line"
                    : "fill-line dark:fill-surface";
                const hover = pickable && !tone ? "hover:fill-line/70 dark:hover:fill-muted/50" : "";
                return (
                  <g
                    key={c.code}
                    onClick={pickable ? () => onPick?.(c.code) : undefined}
                    className={`${fill} ${hover} transition-[fill] duration-150 ${pickable ? "cursor-pointer" : "pointer-events-none"}`}
                  >
                    {c.d && (
                      <path d={c.d} className="stroke-muted/50" vectorEffect="non-scaling-stroke" strokeWidth={0.6} strokeLinejoin="round" />
                    )}
                    {c.marker && (
                      <circle
                        data-marker=""
                        cx={c.marker[0]}
                        cy={c.marker[1]}
                        r={MARKER_RADIUS}
                        className="stroke-muted"
                        vectorEffect="non-scaling-stroke"
                        strokeWidth={1}
                      />
                    )}
                  </g>
                );
              })}
            </>
          )}
        </g>
      </svg>

      {!drawn && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
          {failed ? (
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setAttempt((n) => n + 1);
              }}
              className="underline decoration-line underline-offset-4 hover:text-foreground"
            >
              The map didn&rsquo;t load. Try again
            </button>
          ) : (
            <span className="motion-safe:animate-pulse">Loading the map&hellip;</span>
          )}
        </div>
      )}

      {drawn && (
        <div className="absolute right-3 bottom-3 flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sheet">
          <ZoomButton label="Zoom in" onClick={() => zoomBy(1.6)}>
            <path d="M12 6v12M6 12h12" />
          </ZoomButton>
          <ZoomButton label="Zoom out" onClick={() => zoomBy(1 / 1.6)}>
            <path d="M6 12h12" />
          </ZoomButton>
          <ZoomButton label="Show the whole region" onClick={reset}>
            <path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" />
          </ZoomButton>
        </div>
      )}
    </div>
  );
}

function ZoomButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-10 items-center justify-center border-t border-line text-muted transition-colors first:border-t-0 hover:bg-line/50 hover:text-foreground active:bg-line"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}
