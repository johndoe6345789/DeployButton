"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/api/client";
import type { Workflow } from "@/types";

export default function WorkflowList() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    api
      .listWorkflows()
      .then(setWorkflows)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  function refresh() {
    setLoading(true);
    setError(null);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    const workflow = await api.createWorkflow({
      name: "New Workflow",
      description: "",
    });
    router.push(`/workflows/${workflow.id}`);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this workflow?")) return;
    await api.deleteWorkflow(id);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <Link href="/" className="text-sm text-indigo-600 hover:underline">
            &larr; Back to dashboard
          </Link>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New Workflow
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {workflows.map((w) => (
          <div
            key={w.id}
            className="flex items-center justify-between rounded-lg border border-black/10 p-4 dark:border-white/10"
          >
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/workflows/${w.id}`}
                  className="font-semibold hover:underline"
                >
                  {w.name}
                </Link>
                {w.is_template && (
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    Template
                  </span>
                )}
              </div>
              {w.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {w.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(w.id)}
              className="text-xs text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
