// Builds public/maps/world.json, the Maps mode map, from Natural Earth 1:50m shapes (world-atlas).
// Run with `npm run map:build` after changing the country list; the output is committed.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { geoArea, geoCentroid, geoDistance, geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const topology = structuredClone(require("world-atlas/countries-50m.json"));
const worldCountries = require("world-countries");

// Our 197 countries, by ISO code, straight from the quiz data.
const source = readFileSync(new URL("../data/countries.ts", import.meta.url), "utf8");
const ours = new Set([...source.matchAll(/"code": "([a-z]{2})"/g)].map((m) => m[1]));

const byNumber = Object.fromEntries(worldCountries.map((c) => [c.ccn3, c.cca2.toLowerCase()]));
// Shapes without an ISO number, or drawn apart from the country they belong to.
const byName = { Kosovo: "xk", "N. Cyprus": "cy", Somaliland: "so" };
// Left off the map entirely, so the world view isn't mostly ice.
const dropped = new Set(["010", "260"]); // Antarctica, French Southern Lands

const geometries = [];
for (const geometry of topology.objects.countries.geometries) {
  if (dropped.has(geometry.id)) continue;
  const code = byName[geometry.properties.name] ?? byNumber[geometry.id];
  // Other territories (Greenland, Western Sahara, ...) stay as plain land that can't be picked.
  geometries.push({ type: geometry.type, arcs: geometry.arcs, id: ours.has(code) ? code : "" });
}
topology.objects.countries.geometries = geometries;

// Countries with no shape at this detail get a point instead, at their listed position.
const shaped = new Set(geometries.map((g) => g.id));
const points = {};
for (const code of ours) {
  if (shaped.has(code)) continue;
  const country = worldCountries.find((c) => c.cca2.toLowerCase() === code);
  points[code] = [country.latlng[1], country.latlng[0]];
}

writeFileSync(new URL("../public/maps/world.json", import.meta.url), JSON.stringify({ topology, points }));

// One outline per country for the home page's Maps card (public/maps/shapes/<code>.svg),
// drawn centred on the country so ones crossing the date line (Russia, Fiji) stay whole.
const SHAPE_W = 192;
const SHAPE_H = 144;
const shapesDir = new URL("../public/maps/shapes/", import.meta.url);
mkdirSync(shapesDir, { recursive: true });
const features = feature(topology, topology.objects.countries).features;
// An outline that's mostly ocean would turn its islands into specks, so far-flung pieces
// (French Guiana, the Chatham Islands) are dropped, keeping those near the main island.
// A chain that's still mostly ocean (Micronesia, Palau) is drawn by its main island alone.
const MOSTLY_OCEAN = 0.04;
const NEARBY = (8 * Math.PI) / 180; // about 900 km
const asCollection = (polygons) => ({
  type: "FeatureCollection",
  features: polygons.map((coordinates) => ({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates } })),
});
const oceanShare = (collection) => {
  const probe = geoPath(geoMercator().rotate([-geoCentroid(collection)[0], 0]).fitSize([SHAPE_W, SHAPE_H], collection));
  const [[x0, y0], [x1, y1]] = probe.bounds(collection);
  return probe.area(collection) / Math.max((x1 - x0) * (y1 - y0), 1);
};
const trimmed = (collection) => {
  const polygons = collection.features.flatMap((f) =>
    f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates,
  );
  const area = (rings) => geoArea({ type: "Polygon", coordinates: rings });
  const centre = (rings) => geoCentroid({ type: "Polygon", coordinates: rings });
  const main = polygons.reduce((a, b) => (area(b) > area(a) ? b : a));
  const near = asCollection(polygons.filter((p) => geoDistance(centre(p), centre(main)) <= NEARBY));
  return oceanShare(near) < MOSTLY_OCEAN ? asCollection([main]) : near;
};
for (const code of shaped) {
  if (!code) continue;
  let collection = { type: "FeatureCollection", features: features.filter((f) => f.id === code) };
  if (oceanShare(collection) < MOSTLY_OCEAN) collection = trimmed(collection);
  const projection = geoMercator()
    .rotate([-geoCentroid(collection)[0], 0])
    .fitExtent([[4, 4], [SHAPE_W - 4, SHAPE_H - 4]], collection);
  const d = geoPath(projection).digits(1)(collection);
  writeFileSync(
    new URL(`${code}.svg`, shapesDir),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SHAPE_W} ${SHAPE_H}"><path d="${d}"/></svg>`,
  );
}
console.log(`${shaped.size - 1} countries with shapes, points for: ${Object.keys(points).join(", ") || "none"}`);
