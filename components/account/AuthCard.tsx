import type { ReactNode } from "react";
import Globe from "@/components/Globe";

/** Sign-in and username pages: one lifted sheet, centred like the home page, with the faint globe. */
export default function AuthCard({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 pt-6 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-0 lg:pb-24">
      <div className="relative isolate mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-sheet sm:p-10">
        <Globe className="pointer-events-none absolute -top-32 -right-40 -z-10 size-[22rem] rotate-[-23.4deg] text-line" />
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-[30ch] text-muted">{lead}</p>
        {children}
      </div>
    </main>
  );
}
