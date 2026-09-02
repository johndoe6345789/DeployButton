"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/api/client";
import type { WorkflowRun } from "@/types";

const POLL_INTERVAL_MS = 1500;

// Mirrors useRunPolling, but for a project's run list: the run-history page
// otherwise fetched once on mount, so a still-running row's status pill
// stayed stuck at "running" forever until the viewer manually reloaded.
export function useRunListPolling(projectId: number) {
  const t = useTranslations("common");
  const [runs, setRuns] = useState<WorkflowRun[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const data = await api.listRuns(projectId);
        if (cancelled) return;
        setRuns(data);
        if (data.some((run) => run.status === "running")) {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t("failedToLoad"));
        }
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [projectId]);

  return { runs, error };
}
