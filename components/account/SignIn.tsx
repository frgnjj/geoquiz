"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAccount } from "@/lib/account";
import { safeNext } from "@/lib/safeNext";

/** Where to go after signing in, carried through Google or the email link. */
function nextPath() {
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}

const noSubscribe = () => () => {};

function callbackUrl() {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}`;
}

export default function SignIn() {
  const account = useAccount();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A link that failed (expired, used twice, or opened in another browser) comes back here.
  const linkFailed = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("error") === "link",
    () => false,
  );
  const [tried, setTried] = useState(false);
  const message =
    error ??
    (linkFailed && !tried
      ? "That sign-in link didn't work. Links last one hour and only work in the browser you asked from."
      : null);

  // Already signed in: carry on to where the player was going.
  useEffect(() => {
    if (account.status !== "signed-in") return;
    router.replace(account.username ? nextPath() : `/welcome?next=${encodeURIComponent(nextPath())}`);
  }, [account, router]);

  async function withGoogle() {
    setBusy(true);
    setTried(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
    if (error) {
      setError("Couldn't reach Google. Try again.");
      setBusy(false);
    }
  }

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setTried(true);
    setError(null);
    const address = email.trim();
    const { error } = await createClient().auth.signInWithOtp({
      email: address,
      options: { emailRedirectTo: callbackUrl() },
    });
    setBusy(false);
    if (error) {
      setError(
        error.status === 429
          ? "Too many links sent. Wait a few minutes and try again."
          : "Couldn't send the link. Check the address and try again.",
      );
    } else {
      setSentTo(address);
    }
  }

  if (sentTo) {
    return (
      <div className="mt-8 border-t border-line pt-6">
        <h2 className="text-xl font-semibold tracking-tight">Check your inbox</h2>
        <p className="mt-2 text-muted">
          We sent a sign-in link to <span className="font-medium text-foreground">{sentTo}</span>.
          Open it in this browser.
        </p>
        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-6 rounded-lg text-sm font-medium underline decoration-line underline-offset-4 hover:decoration-foreground"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={withGoogle}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface py-3.5 font-medium shadow-sheet transition-colors hover:border-foreground active:scale-[0.99] disabled:opacity-60"
      >
        <GoogleMark className="size-5" />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4 text-sm text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={withEmail}>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          enterKeyHint="send"
          spellCheck={false}
          className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3.5 shadow-sheet outline-none transition-colors placeholder:text-muted focus:border-foreground"
        />
        <button
          type="submit"
          disabled={busy}
          className="mt-3 w-full rounded-xl bg-foreground py-3.5 font-medium text-background transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          Send link
        </button>
      </form>

      {message && (
        <p role="alert" className="mt-4 text-sm text-wrong">
          {message}
        </p>
      )}

      <p className="mt-8 text-sm text-muted">
        Your email is only used to sign you in, and never shown to anyone.{" "}
        <Link href="/privacy" className="underline decoration-line underline-offset-4 hover:text-foreground hover:decoration-foreground">
          Privacy policy
        </Link>
      </p>
    </div>
  );
}

/** Google's own "G", in its brand colours as Google's sign-in guidelines require. */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
