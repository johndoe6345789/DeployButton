"use client";

import { useLayoutEffect, useRef } from "react";
import AnsiOutput from "./AnsiOutput";
import { useStepOutput } from "@/hooks/useStepOutput";
import styles from "./StepOutputViewer.module.scss";

const SCROLL_TOP_THRESHOLD = 50;
const NEAR_BOTTOM_THRESHOLD = 50;

export default function StepOutputViewer({
  stepRunId,
  isLive,
}: {
  stepRunId: number;
  isLive: boolean;
}) {
  const { fragments, hasEarlier, loadingEarlier, loadEarlier, error } =
    useStepOutput(stepRunId, isLive);
  const containerRef = useRef<HTMLPreElement>(null);
  const prevFirstFragmentIdRef = useRef<string | undefined>(undefined);
  const prevScrollHeightRef = useRef(0);
  const wasNearBottomRef = useRef(true);

  // Keep the visible content stable across a prepend (loadEarlier) by
  // shifting scrollTop by exactly how much scrollHeight grew, and only
  // auto-follow appended (live) content if the user was already at/near the
  // bottom -- don't yank their position if they scrolled up mid-run.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const newFirstId = fragments[0]?.id;
    const wasPrepend =
      prevFirstFragmentIdRef.current !== undefined &&
      newFirstId !== prevFirstFragmentIdRef.current &&
      prevScrollHeightRef.current > 0;

    if (wasPrepend) {
      el.scrollTop += el.scrollHeight - prevScrollHeightRef.current;
    } else if (wasNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }

    prevFirstFragmentIdRef.current = newFirstId;
    prevScrollHeightRef.current = el.scrollHeight;
  }, [fragments]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    wasNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
    if (el.scrollTop < SCROLL_TOP_THRESHOLD && hasEarlier && !loadingEarlier) {
      loadEarlier();
    }
  }

  if (fragments.length === 0 && !error) {
    return null;
  }

  return (
    <pre
      ref={containerRef}
      className={styles.output}
      onScroll={handleScroll}
      data-testid="step-output-viewer"
    >
      {loadingEarlier && (
        <div className={styles.status}>Loading earlier output…</div>
      )}
      {fragments.map((fragment) => (
        <AnsiOutput key={fragment.id} text={fragment.text} />
      ))}
      {error && <div className={styles.status}>{error}</div>}
    </pre>
  );
}
