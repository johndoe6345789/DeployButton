"use client";

import { useCallback, useRef, useState } from "react";

export interface OutputFragment {
  id: string;
  text: string;
}

// Manages an ordered list of immutable output fragments -- each fetch
// becomes exactly one new fragment (prepended or appended), so re-renders
// never re-parse/re-diff content already fetched. Resets synchronously
// during render (comparing against the previous stepRunId via useState,
// not a ref -- refs can't be read/written during render) whenever
// stepRunId changes. See "Storing information from previous renders" at
// https://react.dev/reference/react/useState.
export function useOutputFragments(stepRunId: number) {
  const [fragments, setFragments] = useState<OutputFragment[]>([]);
  const [prevStepRunId, setPrevStepRunId] = useState(stepRunId);
  const nextId = useRef(0);

  if (stepRunId !== prevStepRunId) {
    setPrevStepRunId(stepRunId);
    setFragments([]);
  }

  const pushFragment = useCallback((text: string, prepend: boolean) => {
    if (text.length === 0) return;
    const fragment = { id: `f${nextId.current++}`, text };
    setFragments((prev) =>
      prepend ? [fragment, ...prev] : [...prev, fragment],
    );
  }, []);

  return { fragments, pushFragment };
}
