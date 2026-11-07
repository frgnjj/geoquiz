import type { Metadata } from "next";
import MapExplorer from "@/components/map/MapExplorer";

export const metadata: Metadata = { title: "Maps · Geoquiz" };

// A preview of the Maps mode map. Not linked yet; the game replaces this in the next step.
export default function MapsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-8">
      <h1 className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] lg:text-6xl">Maps</h1>
      <p className="mt-3 text-lg text-muted">Pinch, scroll or drag to move around.</p>
      <MapExplorer />
    </main>
  );
}
