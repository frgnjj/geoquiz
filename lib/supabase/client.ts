import { createBrowserClient } from "@supabase/ssr";

/** The Supabase client for the browser. It keeps the session in cookies, so the server can read it too. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
