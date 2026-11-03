/** Keeps a "next" address on this site, so a sign-in link can't send players elsewhere. */
export function safeNext(next: string | null | undefined) {
  return next && /^\/(?![/\\])/.test(next) ? next : "/";
}
