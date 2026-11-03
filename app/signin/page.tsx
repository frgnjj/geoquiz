import type { Metadata } from "next";
import SignIn from "@/components/account/SignIn";

export const metadata: Metadata = { title: "Sign in · Geoquiz" };

export default function SignInPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-16">
      <h1 className="text-4xl font-semibold tracking-[-0.03em]">Sign in</h1>
      <p className="mt-3 text-muted">Save your scores and see where you rank. No password needed.</p>
      <SignIn />
    </main>
  );
}
