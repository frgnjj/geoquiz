import type { PostgrestError } from "@supabase/supabase-js";

/** 3 to 20 letters, numbers or underscores. The database checks the same rule. */
export const USERNAME_FORMAT = /^[A-Za-z0-9_]{3,20}$/;

export const USERNAME_RULE = "Use 3 to 20 letters, numbers or underscores.";

/** What to tell the player when the database turns a username down. */
export function usernameError(error: PostgrestError): string {
  if (error.code === "23505") {
    return error.message.includes("pkey")
      ? "You already have a username. Reload the page."
      : "That username is taken. Try another.";
  }
  if (error.code === "23514") {
    return error.message.includes("username_allowed") ? "That username isn't allowed. Try another." : USERNAME_RULE;
  }
  return "Couldn't save your username. Try again.";
}
