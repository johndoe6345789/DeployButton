"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const NEAR_BOTTOM_THRESHOLD = 80;

/**
 * Follows the bottom of the page while `dependency` keeps changing (a
 * polling run's data, in practice) -- the same "tail -f" pattern
 * StepOutputViewer already uses for its own scrollable log box, but for the
 * page itself, so a newly-appeared or newly-updated step scrolls into view
 * without the viewer reaching for the mouse. Only follows while `active`,
 * and never yanks someone who scrolled up to re-read an earlier step: it
 * tracks whether they were already at/near the bottom before the update and
 * only re-follows if so.
 */
export function useAutoScrollToBottom(dependency: unknown, active: boolean) {
  const wasNearBottomRef = useRef(true);

  useEffect(() => {
    if (!active) return undefined;

    function handleScroll() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      wasNearBottomRef.current =
        scrollable - window.scrollY < NEAR_BOTTOM_THRESHOLD;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  useLayoutEffect(() => {
    if (!active || !wasNearBottomRef.current) return;
    window.scrollTo({ top: document.documentElement.scrollHeight });
  }, [dependency, active]);
}
