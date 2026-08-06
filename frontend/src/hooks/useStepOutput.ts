"use client";

import { useOutputFragments } from "./useOutputFragments";
import { useStepOutputPolling } from "./useStepOutputPolling";

export interface UseStepOutputResult {
  fragments: { id: string; text: string }[];
  hasEarlier: boolean;
  loadingEarlier: boolean;
  loadEarlier: () => void;
  error: string | null;
}

// Loads a step's output as an ordered list of immutable fragments instead of
// one growing string, so re-renders never re-parse/re-diff content that was
// already fetched. useOutputFragments owns the fragment list itself;
// useStepOutputPolling owns fetching (tail load, loadEarlier, live-tail
// polling) -- this just wires the two together.
export function useStepOutput(
  stepRunId: number,
  isLive: boolean,
): UseStepOutputResult {
  const { fragments, pushFragment } = useOutputFragments(stepRunId);
  const { hasEarlier, loadingEarlier, loadEarlier, error } =
    useStepOutputPolling(stepRunId, isLive, pushFragment);

  return { fragments, hasEarlier, loadingEarlier, loadEarlier, error };
}
