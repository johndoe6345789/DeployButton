"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/api/client";
import type { RunDetail } from "@/types";

const POLL_INTERVAL_MS = 1500;

export function useRunPolling(runId: number) {
  const [run, setRun] = useState<RunDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await api.getRun(runId);
        if (cancelled) return;
        setRun(data);
        if (data.status === "running") {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [runId]);

  return { run, error };
}
