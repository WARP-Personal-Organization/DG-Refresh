"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AutoRefresh({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    // Skip refreshing backgrounded/minimized tabs — a tab left open overnight
    // was polling the server every intervalMs regardless of whether anyone
    // was looking, each hit a candidate for a billed ISR regeneration.
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
