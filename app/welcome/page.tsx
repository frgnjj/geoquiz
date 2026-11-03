import type { Metadata } from "next";
import PickUsername from "@/components/account/PickUsername";

export const metadata: Metadata = { title: "Pick a username · Geoquiz" };

export default function WelcomePage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-16">
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Pick a username</h1>
      <p className="mt-3 text-muted">It&rsquo;s the name other players see on the leaderboards.</p>
      <PickUsername />
    </main>
  );
}
