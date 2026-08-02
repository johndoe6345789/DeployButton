"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/api/client";
import type { RunDetail } from "@/types";
import StatusBadge from "@/components/StatusBadge";

const POLL_INTERVAL_MS = 1500;

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = Number(params.id);

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
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [runId]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={run ? `/projects/${run.project_id}/runs` : "/"}
        className="text-sm text-indigo-600 hover:underline"
      >
        &larr; Back to run history
      </Link>

      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-2xl font-bold">Run #{runId}</h1>
        {run && <StatusBadge status={run.status} />}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!run && !error && <p className="mt-4 text-sm text-gray-500">Loading...</p>}

      <div className="mt-6 flex flex-col gap-3">
        {run?.step_runs.map((step) => (
          <div
            key={step.id}
            className="rounded-md border border-black/10 dark:border-white/10"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-3 py-2 dark:border-white/10">
              <span className="text-sm font-medium">{step.name}</span>
              <StatusBadge status={step.status} />
            </div>
            {step.output && (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap p-3 text-xs text-gray-700 dark:text-gray-300">
                {step.output}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
