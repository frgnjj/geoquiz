import { geoArea, geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, GeoJsonProperties, MultiPoint, MultiPolygon, Polygon } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { Continent } from "@/data/countries";

/** public/maps/world.json, built by scripts/build-map.mjs. */
export type WorldData = {
  topology: Topology<{ countries: GeometryCollection }>;
  /** Countries too small for a shape at this detail, as [longitude, latitude]. */
  points: Record<string, [number, number]>;
};

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 600;
const PADDING = 16;
/** Countries with less land than this (square map units, before zooming) also get a round marker.
 * It's area, not size, so island nations spread over the ocean still count as tiny. */
const TINY_AREA = 40;

type View = { rotate: number; bounds: [west: number, south: number, east: number, north: number] };

// What each region shows: a box in longitude and latitude, and where the map is centred.
// Oceania is centred on the Pacific so its islands aren't split by the date line.
const WORLD: View = { rotate: -10, bounds: [-180, -57, 180, 84] };
const VIEWS: Record<Continent, View> = {
  Africa: { rotate: -10, bounds: [-20, -36, 55, 38] },
  Asia: { rotate: -10, bounds: [25, -12, 150, 56] },
  Europe: { rotate: -10, bounds: [-25, 34, 45, 71] },
  "North America": { rotate: -10, bounds: [-170, 5, -52, 72] },
  "South America": { rotate: -10, bounds: [-85, -56, -33, 13] },
  Oceania: { rotate: -160, bounds: [110, -48, 210, 8] },
};

/** The view for a game's region: World, one continent, or the box around several. */
export function viewFor(continents: Continent[]): View {
  if (continents.length === 0) return WORLD;
  if (continents.length === 1) return VIEWS[continents[0]];
  // Oceania sits across the date line, so mixing it with other continents shows the world.
  if (continents.includes("Oceania")) return WORLD;
  const boxes = continents.map((c) => VIEWS[c].bounds);
  return {
    rotate: -10,
    bounds: [
      Math.min(...boxes.map((b) => b[0])),
      Math.min(...boxes.map((b) => b[1])),
      Math.max(...boxes.map((b) => b[2])),
      Math.max(...boxes.map((b) => b[3])),
    ],
  };
}

/** Points along the edges of a box, so the projection fits the box's curved outline. */
function outline([west, south, east, north]: View["bounds"]): MultiPoint {
  const coordinates: [number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const lon = west + ((east - west) * i) / 20;
    const lat = south + ((north - south) * i) / 20;
    coordinates.push([lon, south], [lon, north], [west, lat], [east, lat]);
  }
  return { type: "MultiPoint", coordinates };
}

export type MapCountry = {
  code: string;
  /** SVG path data for the country's shape, or empty for countries shown only as a point. */
  d: string;
  /** Where its round marker sits, when it's too small to click comfortably. */
  marker: [number, number] | null;
};

/** Projects every shape for a view: our countries, and the other land drawn as background. */
export function drawMap(data: WorldData, view: View) {
  const projection = geoNaturalEarth1()
    .rotate([view.rotate, 0])
    .fitExtent(
      [
        [PADDING, PADDING],
        [MAP_WIDTH - PADDING, MAP_HEIGHT - PADDING],
      ],
      outline(view.bounds),
    );
  const path = geoPath(projection);

  const features = feature(data.topology, data.topology.objects.countries).features as Feature<
    Polygon | MultiPolygon,
    GeoJsonProperties
  >[];

  // Some countries come in more than one piece (Cyprus, Somalia), so pieces are grouped by code.
  const pieces = new Map<string, Feature<Polygon | MultiPolygon, GeoJsonProperties>[]>();
  const land: string[] = [];
  for (const f of features) {
    const code = String(f.id ?? "");
    if (!code) {
      land.push(path(f) ?? "");
      continue;
    }
    pieces.set(code, [...(pieces.get(code) ?? []), f]);
  }

  const countries: MapCountry[] = [];
  for (const [code, group] of pieces) {
    const d = group.map((f) => path(f) ?? "").join("");
    const tiny = path.area({ type: "FeatureCollection", features: group }) < TINY_AREA;
    countries.push({ code, d, marker: tiny ? markerAt(group, projection) : null });
  }
  for (const [code, lonLat] of Object.entries(data.points)) {
    const at = projection(lonLat);
    countries.push({ code, d: "", marker: at ? [at[0], at[1]] : null });
  }

  return { land: land.join(""), countries };
}

/** The centre of a country's largest piece, so island nations get their marker on land. */
function markerAt(
  group: Feature<Polygon | MultiPolygon, GeoJsonProperties>[],
  projection: ReturnType<typeof geoNaturalEarth1>,
): [number, number] | null {
  const polygons: Polygon[] = group.flatMap((f) =>
    f.geometry.type === "Polygon"
      ? [f.geometry]
      : f.geometry.coordinates.map((coordinates) => ({ type: "Polygon" as const, coordinates })),
  );
  const largest = polygons.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
  const at = projection(geoCentroid(largest));
  return at ? [at[0], at[1]] : null;
}

let cached: Promise<WorldData> | null = null;

/** Loads the map once per visit; it's only fetched on the Maps page. */
export function loadWorld(): Promise<WorldData> {
  cached ??= fetch("/maps/world.json").then((r) => {
    if (!r.ok) throw new Error(`Map failed to load (${r.status})`);
    return r.json() as Promise<WorldData>;
  });
  cached.catch(() => (cached = null));
  return cached;
}
