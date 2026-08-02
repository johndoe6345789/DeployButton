"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import RunStepItem from "@/components/RunStepItem";
import StatusBadge from "@/components/StatusBadge";
import { useRunPolling } from "@/hooks/useRunPolling";

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = Number(params.id);
  const { run, error } = useRunPolling(runId);

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
      {!run && !error && (
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {run?.step_runs.map((step) => (
          <RunStepItem key={step.id} step={step} />
        ))}
      </div>
    </div>
  );
}
