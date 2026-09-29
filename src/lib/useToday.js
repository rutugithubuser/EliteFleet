"use client";

import { useSyncExternalStore } from "react";

function todayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Today's date as "YYYY-MM-DD" (used as the earliest date a visitor can pick).
// It is only known in the visitor's browser (pages are pre-built on the server),
// so this returns "" while pre-building and the real date in the browser,
// without a hydration mismatch.
const noSubscribe = () => () => {};
export function useToday() {
  return useSyncExternalStore(noSubscribe, todayLocal, () => "");
}
