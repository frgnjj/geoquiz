"use client";

import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type Account =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; userId: string; email?: string; username: string | null };

const LOADING: Account = { status: "loading" };

// The signed-in player, shared by every component that asks for it.
let account: Account = LOADING;
let started = false;
const listeners = new Set<() => void>();

function set(next: Account) {
  account = next;
  listeners.forEach((listener) => listener());
}

async function load(user: User | null) {
  if (!user) return set({ status: "signed-out" });
  const { data } = await createClient()
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();
  set({ status: "signed-in", userId: user.id, email: user.email, username: data?.username ?? null });
}

function start() {
  if (started) return;
  started = true;
  createClient().auth.onAuthStateChange((event, session) => {
    if (event === "TOKEN_REFRESHED") return;
    // Supabase asks for no awaited calls inside this callback, so the profile loads just after.
    setTimeout(() => load(session?.user ?? null), 0);
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAccount() {
  return useSyncExternalStore(subscribe, () => account, () => LOADING);
}

/** Shows a newly picked username everywhere without reloading. */
export function setAccountUsername(username: string) {
  if (account.status === "signed-in") set({ ...account, username });
}

export async function signOut() {
  await createClient().auth.signOut();
}
