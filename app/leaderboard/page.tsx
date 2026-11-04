import { Suspense } from "react";
import type { Metadata } from "next";
import Leaderboard from "@/components/Leaderboard";

export const metadata: Metadata = { title: "Leaderboards · Geoquiz" };

export default function LeaderboardPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-8">
      <h1 className="text-5xl leading-[1.05] font-semibold tracking-[-0.03em] lg:text-6xl">
        Leaderboards
      </h1>
      <p className="mt-3 text-lg text-muted">Each player&rsquo;s best in Ranked and Hardcore games.</p>
      {/* The board comes from the address, which is only known in the browser. */}
      <Suspense>
        <Leaderboard />
      </Suspense>
    </main>
  );
}
