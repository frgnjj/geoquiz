"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAccountUsername, useAccount } from "@/lib/account";
import { safeNext } from "@/lib/safeNext";
import { USERNAME_FORMAT, USERNAME_RULE, usernameError } from "@/lib/username";

function nextPath() {
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}

/** First sign-in: the player picks the name shown on leaderboards. */
export default function PickUsername() {
  const account = useAccount();
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Players who already have a name skip this step.
  const hasName = account.status === "signed-in" && account.username !== null;
  useEffect(() => {
    if (hasName) router.replace(nextPath());
  }, [hasName, router]);

  if (account.status === "loading" || hasName) return <div className="mt-8 h-40" />;

  if (account.status === "signed-out") {
    return (
      <p className="mt-8 text-muted">
        <Link href="/signin" className="font-medium text-foreground underline decoration-line underline-offset-4 hover:decoration-foreground">
          Sign in
        </Link>{" "}
        first to pick a username.
      </p>
    );
  }

  const userId = account.userId;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const username = name.trim();
    if (!USERNAME_FORMAT.test(username)) {
      setError(USERNAME_RULE);
      return;
    }
    setBusy(true);
    setError(null);
    const { error } = await createClient().from("profiles").insert({ id: userId, username });
    setBusy(false);
    if (error) {
      setError(usernameError(error));
    } else {
      setAccountUsername(username);
      router.replace(nextPath());
    }
  }

  return (
    <form onSubmit={save} className="mt-8">
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <input
        id="username"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={20}
        placeholder="atlas_fan"
        autoComplete="username"
        autoCapitalize="none"
        autoCorrect="off"
        enterKeyHint="done"
        spellCheck={false}
        aria-describedby="username-hint"
        className="mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3.5 shadow-sheet outline-none transition-colors placeholder:text-muted focus:border-foreground"
      />
      <p id="username-hint" className="mt-2 text-sm text-muted">
        3 to 20 letters, numbers or underscores. You can change it later.
      </p>
      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-xl bg-foreground py-3.5 font-medium text-background transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        Save username
      </button>
      {error && (
        <p role="alert" className="mt-4 text-sm text-wrong">
          {error}
        </p>
      )}
    </form>
  );
}
