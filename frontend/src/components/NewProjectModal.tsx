"use client";

import { useEffect, useState } from "react";
import { api } from "@/api/client";
import type { Project, Workflow } from "@/types";

export default function NewProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .listWorkflows()
      .then((list) => {
        setWorkflows(list);
        if (list.length > 0) setWorkflowId(list[0].id);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load workflows"));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workflowId) {
      setError("Choose a workflow");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const project = await api.createProject({
        name,
        slug,
        repo_url: repoUrl,
        workflow_id: workflowId,
      });
      onCreated(project);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create project");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">New Project</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-black/20 px-2 py-1 dark:border-white/20 dark:bg-neutral-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Slug (used in the webhook URL)
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-app"
              className="rounded-md border border-black/20 px-2 py-1 dark:border-white/20 dark:bg-neutral-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Repo URL
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="github.com/you/my-app"
              className="rounded-md border border-black/20 px-2 py-1 dark:border-white/20 dark:bg-neutral-800"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Workflow
            <select
              value={workflowId ?? ""}
              onChange={(e) => setWorkflowId(Number(e.target.value))}
              className="rounded-md border border-black/20 px-2 py-1 dark:border-white/20 dark:bg-neutral-800"
            >
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
