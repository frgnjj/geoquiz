// Builds public/maps/world.json, the Maps mode map, from Natural Earth 1:50m shapes (world-atlas).
// Run with `npm run map:build` after changing the country list; the output is committed.
import { readFileSync, writeFileSync } from "node:fs";
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
console.log(`${shaped.size - 1} countries with shapes, points for: ${Object.keys(points).join(", ") || "none"}`);
