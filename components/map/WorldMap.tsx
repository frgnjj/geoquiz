"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { easeCubicInOut } from "d3-ease";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, zoomTransform, type D3ZoomEvent, type ZoomBehavior } from "d3-zoom";
import type { Continent } from "@/data/countries";
import { drawMap, FLIGHT_MS, loadWorld, MAP_HEIGHT, MAP_WIDTH, viewFor, type MapCountry, type WorldData } from "@/lib/map";

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
  /** A country to keep in view: the map slides to it when it's off screen. */
  focus?: string;
  /** A country to zoom to (Name it): the map flies there, keeping its neighbours in view. */
  follow?: string;
  label: string;
  /** "fill" takes the size of its container (the game); otherwise the map keeps a 5:3 shape. */
  size?: "fill" | "aspect";
  /** Extra classes for the frame, such as dropping the rounded edge when the map runs edge to edge. */
  className?: string;
};

const MARKER_RADIUS = 5;
const RING_RADIUS = 13;
/** When following a country, it takes up about this share of the frame, so its neighbours show too. */
const FOLLOW_SHARE = 0.35;
const FOLLOW_MAX_ZOOM = 6;
/** The most the view widens halfway through a long flight: a short pull back, not a trip out to space. */
const FLIGHT_PULL_BACK = 0.35;
/** Flights up to about a screen-width (Germany to Romania) just glide; the pull back grows until FAR_HOP. */
const NEAR_HOP = 1;
const FAR_HOP = 3;

type ZoomView = [x: number, y: number, width: number];

/**
 * A flight between two views: a straight pan. A neighbour (Egypt to Sudan) is a glide at the same
 * zoom; the farther the next country, the more the view widens in the middle, up to FLIGHT_PULL_BACK.
 */
function gentleFlight(a: ZoomView, b: ZoomView) {
  const hop = Math.hypot(b[0] - a[0], b[1] - a[1]) / ((a[2] + b[2]) / 2);
  const reach = Math.min(1, Math.max(0, (hop - NEAR_HOP) / (FAR_HOP - NEAR_HOP)));
  return (t: number): ZoomView => {
    const pullBack = 1 + FLIGHT_PULL_BACK * reach * Math.sin(Math.PI * t);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (a[2] + (b[2] - a[2]) * t) * pullBack];
  };
}
const MAX_ZOOM = 12;

const FILL: Record<CountryTone, string> = {
  highlight: "fill-foreground",
  correct: "fill-correct",
  wrong: "fill-wrong",
};

/** The Maps mode map: an atlas page of the region, with zoom, pan and clickable countries. */
export default function WorldMap({
  continents,
  region,
  tones = {},
  onPick,
  focus,
  follow,
  label,
  size = "aspect",
  className = "",
}: Props) {
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

  // In "fill" mode the map is drawn for the frame's own size, so it uses all of it.
  const frameRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    const el = frameRef.current;
    if (size !== "fill" || !el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (width > 0 && height > 0) setFrame({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [size]);
  const width = size === "fill" ? (frame?.width ?? 0) : MAP_WIDTH;
  const height = size === "fill" ? (frame?.height ?? 0) : MAP_HEIGHT;

  const key = continents.join("|");
  const view = useMemo(() => viewFor(continents), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const drawn = useMemo(
    () => (world && width > 0 ? drawMap(world, view, region, width, height) : null),
    [world, view, region, width, height],
  );
  const inRegion = useMemo(() => new Set(region), [region]);

  // One stable click handler, so a new question only redraws the countries whose colour changed.
  const onPickRef = useRef(onPick);
  useLayoutEffect(() => {
    onPickRef.current = onPick;
  });
  const pick = useCallback((code: string) => onPickRef.current?.(code), []);

  const svgRef = useRef<SVGSVGElement>(null);
  const layerRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Pinch, scroll and drag move one layer; markers stay the same size on screen at any zoom.
  const ready = drawn !== null;
  useEffect(() => {
    const svg = svgRef.current;
    const layer = layerRef.current;
    if (!svg || !layer || !ready) return;
    const behavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, MAX_ZOOM])
      .clickDistance(6)
      .interpolate(gentleFlight)
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        const { x, y, k } = event.transform;
        layer.setAttribute("transform", `translate(${x},${y}) scale(${k})`);
        layer.querySelectorAll<SVGCircleElement>("circle[data-marker]").forEach((c) => {
          c.setAttribute("r", String((c.hasAttribute("data-ring") ? RING_RADIUS : MARKER_RADIUS) / k));
        });
      });
    zoomRef.current = behavior;
    const selection = select(svg);
    selection.call(behavior).on("dblclick.zoom", null);
    return () => {
      selection.on(".zoom", null);
    };
  }, [ready]);

  // A new size (a line of text appearing, a phone turning) keeps the current zoom; only how far
  // you can drag changes.
  useEffect(() => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (!svg || !behavior || !drawn) return;
    behavior.translateExtent(drawn.reach);
    select(svg).call(behavior.transform, zoomTransform(svg));
  }, [drawn]);

  // A new region starts from the whole region.
  useEffect(() => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    if (svg && behavior && ready) select(svg).call(behavior.transform, zoomIdentity);
  }, [view, ready]);

  // A ring drawn for a new question starts at the current zoom's size, like the other markers.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    const layer = layerRef.current;
    if (!svg || !layer) return;
    const { k } = zoomTransform(svg);
    layer.querySelectorAll<SVGCircleElement>("circle[data-ring]").forEach((c) => c.setAttribute("r", String(RING_RADIUS / k)));
  }, [tones, drawn]);

  // Brings the focused country on screen when the current zoom and pan hide it.
  useEffect(() => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    const country = drawn?.countries.find((c) => c.code === focus);
    if (!svg || !behavior || !country) return;
    const t = zoomTransform(svg);
    // A tiny country is aimed at by its marker: its outline can span the date line (Kiribati).
    const [[x0, y0], [x1, y1]] = country.marker ? [country.marker, country.marker] : country.box;
    const margin = 24;
    const visible =
      t.applyX(x0) >= margin && t.applyX(x1) <= width - margin && t.applyY(y0) >= margin && t.applyY(y1) <= height - margin;
    if (!visible) select(svg).call(behavior.translateTo, (x0 + x1) / 2, (y0 + y1) / 2);
  }, [focus, drawn, width, height]);

  // Name it: fly to each highlighted country, pulling out a little mid-flight and back in.
  // A resize alone doesn't start a new flight.
  const followed = useRef<{ code: string; view: typeof view } | null>(null);
  useEffect(() => {
    const svg = svgRef.current;
    const behavior = zoomRef.current;
    const country = drawn?.countries.find((c) => c.code === follow);
    if (!svg || !behavior || !country) return;
    if (followed.current?.code === country.code && followed.current.view === view) return;
    followed.current = { code: country.code, view };
    // A tiny country is aimed at by its marker: its outline can span the date line (Kiribati).
    const [[x0, y0], [x1, y1]] = country.marker ? [country.marker, country.marker] : country.box;
    const fit = Math.min(width / Math.max(x1 - x0, 1), height / Math.max(y1 - y0, 1));
    const k = Math.max(1, Math.min(FOLLOW_MAX_ZOOM, FOLLOW_SHARE * fit));
    const target = zoomIdentity.translate(width / 2 - k * ((x0 + x1) / 2), height / 2 - k * ((y0 + y1) / 2)).scale(k);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    select(svg)
      .transition()
      .duration(still ? 0 : FLIGHT_MS)
      .ease(easeCubicInOut)
      .call(behavior.transform, target);
  }, [follow, drawn, width, height, view]);

  function zoomBy(factor: number) {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.scaleBy, factor);
  }
  function reset() {
    if (svgRef.current && zoomRef.current) select(svgRef.current).call(zoomRef.current.transform, zoomIdentity);
  }

  return (
    // Sea, then other land, then the region, each a step lighter (light mode) or brighter (dark mode).
    <div
      ref={frameRef}
      className={`relative overflow-hidden rounded-2xl border border-line bg-line/40 shadow-sheet dark:bg-background ${
        size === "fill" ? "h-full w-full" : ""
      } ${className}`}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width || MAP_WIDTH} ${height || MAP_HEIGHT}`}
        role="img"
        aria-label={label}
        className={`block w-full touch-none select-none ${size === "fill" ? "absolute inset-0 h-full" : "aspect-[5/3]"}`}
      >
        <g ref={layerRef}>
          {drawn && (
            <>
              <path d={drawn.land} className="fill-line stroke-muted/30 dark:fill-surface" vectorEffect="non-scaling-stroke" strokeWidth={0.5} />
              {drawn.countries.map((c) => (
                <CountryShape
                  key={c.code}
                  country={c}
                  tone={tones[c.code]}
                  inRegion={inRegion.has(c.code)}
                  pickable={Boolean(onPick) && inRegion.has(c.code)}
                  onPick={pick}
                />
              ))}
              {/* Markers come after every shape, so no country or border is ever drawn over them. */}
              {drawn.countries.map(
                (c) =>
                  c.marker &&
                  inRegion.has(c.code) && (
                    <CountryMarker
                      key={c.code}
                      code={c.code}
                      at={c.marker}
                      tone={tones[c.code]}
                      pickable={Boolean(onPick)}
                      onPick={pick}
                    />
                  ),
              )}
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

/** One country's shape. Tiny countries also get a CountryMarker, drawn above every shape. */
const CountryShape = memo(function CountryShape({
  country: c,
  tone,
  inRegion,
  pickable,
  onPick,
}: {
  country: MapCountry;
  tone?: CountryTone;
  inRegion: boolean;
  pickable: boolean;
  onPick: (code: string) => void;
}) {
  const fill = tone ? FILL[tone] : inRegion ? "fill-surface dark:fill-line" : "fill-line dark:fill-surface";
  const hover = pickable && !tone ? "hover:fill-line/70 dark:hover:fill-muted/50" : "";
  return (
    <g
      data-code={c.code}
      onClick={pickable ? () => onPick(c.code) : undefined}
      className={`${fill} ${hover} transition-[fill] duration-150 ${pickable ? "cursor-pointer" : "pointer-events-none"}`}
    >
      {c.d && <path d={c.d} className="stroke-muted/50" vectorEffect="non-scaling-stroke" strokeWidth={0.6} strokeLinejoin="round" />}
    </g>
  );
});

/** A tiny country's round marker, clickable like its shape. The one asked about gets a ring too. */
const CountryMarker = memo(function CountryMarker({
  code,
  at,
  tone,
  pickable,
  onPick,
}: {
  code: string;
  at: [number, number];
  tone?: CountryTone;
  pickable: boolean;
  onPick: (code: string) => void;
}) {
  const fill = tone ? FILL[tone] : "fill-surface dark:fill-line";
  const hover = pickable && !tone ? "hover:fill-line dark:hover:fill-muted/50" : "";
  return (
    <g
      data-marker-for={code}
      onClick={pickable ? () => onPick(code) : undefined}
      className={`${fill} ${hover} transition-[fill] duration-150 ${pickable ? "cursor-pointer" : "pointer-events-none"}`}
    >
      {tone === "highlight" && (
        <circle
          data-marker=""
          data-ring=""
          cx={at[0]}
          cy={at[1]}
          r={RING_RADIUS}
          className="fill-none stroke-foreground"
          vectorEffect="non-scaling-stroke"
          strokeWidth={1.5}
        />
      )}
      <circle
        data-marker=""
        cx={at[0]}
        cy={at[1]}
        r={MARKER_RADIUS}
        className="stroke-muted"
        vectorEffect="non-scaling-stroke"
        strokeWidth={1}
      />
    </g>
  );
});

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
