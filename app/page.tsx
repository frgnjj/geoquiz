import { COUNTRIES } from "@/data/countries";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-24">
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight">Geoquiz</h1>
        <p className="mt-3 text-zinc-500">
          Test your geography. {COUNTRIES.length} countries.
        </p>
      </div>
      <div className="flex gap-4">
        {["Flags", "Capitals"].map((mode) => (
          <div
            key={mode}
            className="w-56 rounded-xl border border-zinc-200 px-8 py-10 text-center text-xl font-medium dark:border-zinc-800"
          >
            {mode}
            <p className="mt-2 text-sm font-normal text-zinc-500">Coming soon</p>
          </div>
        ))}
      </div>
    </main>
  );
}
