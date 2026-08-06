"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/api/client";
import { fetchAndSchedule } from "./stepOutputFetch";
import type { FetchState } from "./stepOutputFetch";

// Owns the tail/loadEarlier/live-tail fetch orchestration for a step's
// output -- see stepOutputFetch.ts for the tail/live-tail fetch logic
// itself, kept out of this file to stay under the line-count limit.
export function useStepOutputPolling(
  stepRunId: number,
  isLive: boolean,
  pushFragment: (text: string, prepend: boolean) => void,
) {
  const [hasEarlier, setHasEarlier] = useState(false);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prevStepRunId, setPrevStepRunId] = useState(stepRunId);
  const startOffsetRef = useRef(0);
  const endOffsetRef = useRef(0);
  const isLiveRef = useRef(isLive);

  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  // Reset during render, not setState-in-effect -- see "Storing
  // information from previous renders" at
  // react.dev/reference/react/useState.
  if (stepRunId !== prevStepRunId) {
    setPrevStepRunId(stepRunId);
    setHasEarlier(false);
    setLoadingEarlier(false);
    setError(null);
  }

  const loadEarlier = useCallback(() => {
    if (!hasEarlier || loadingEarlier) return;
    setLoadingEarlier(true);
    api
      .getStepOutput(stepRunId, { before: startOffsetRef.current })
      .then((chunk) => {
        startOffsetRef.current = chunk.start_offset;
        setHasEarlier(chunk.start_offset > 0);
        pushFragment(chunk.text, true);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load output");
      })
      .finally(() => setLoadingEarlier(false));
  }, [stepRunId, hasEarlier, loadingEarlier, pushFragment]);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const state: FetchState = {
      cancelled: false,
      isLive: () => isLiveRef.current,
      startOffsetRef,
      endOffsetRef,
      setTimer: (id) => {
        timerId = id;
      },
      pushFragment,
      setHasEarlier,
      setError,
    };
    startOffsetRef.current = 0;
    endOffsetRef.current = 0;
    fetchAndSchedule(stepRunId, true, state);

    return () => {
      state.cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [stepRunId, pushFragment]);

  return { hasEarlier, loadingEarlier, loadEarlier, error };
}
