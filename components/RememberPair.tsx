"use client";

import { useEffect } from "react";
import { PAIR_COOKIE } from "@/lib/homePair";

/** Remembers the home page's flag and capital so the next load picks different ones. */
export default function RememberPair({ value }: { value: string }) {
  useEffect(() => {
    document.cookie = `${PAIR_COOKIE}=${value}; path=/; max-age=31536000; samesite=lax`;
  }, [value]);
  return null;
}
