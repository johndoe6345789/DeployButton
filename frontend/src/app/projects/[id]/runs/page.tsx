"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/api/client";
import type { Project, WorkflowRun } from "@/types";
import StatusBadge from "@/components/StatusBadge";

export default function RunHistory() {
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getProject(projectId), api.listRuns(projectId)])
      .then(([p, r]) => {
        setProject(p);
        setRuns(r);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-indigo-600 hover:underline">
        &larr; Back to dashboard
      </Link>

      <h1 className="mt-2 text-2xl font-bold">
        {project ? `${project.name} — Run History` : "Run History"}
      </h1>

      {loading && <p className="mt-4 text-sm text-gray-500">Loading...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!loading && runs.length === 0 && !error && (
        <p className="mt-4 text-sm text-gray-500">No runs yet.</p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {runs.map((run) => (
          <Link
            key={run.id}
            href={`/runs/${run.id}`}
            className="flex flex-col gap-1 rounded-md border border-black/10 p-3 hover:bg-black/5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:hover:bg-white/5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={run.status} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {run.trigger_type === "manual" ? "Manual" : "GitHub webhook"}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {run.started_at}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
