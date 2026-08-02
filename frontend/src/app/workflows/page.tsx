"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/api/client";
import WorkflowListItem from "@/components/WorkflowListItem";
import { useWorkflows } from "@/hooks/useWorkflows";

export default function WorkflowList() {
  const router = useRouter();
  const { workflows, loading, error, refresh } = useWorkflows();

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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <Link href="/" className="text-sm text-indigo-600 hover:underline">
            &larr; Back to dashboard
          </Link>
        </div>
        <button
          onClick={handleCreate}
          className="self-start rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 sm:self-auto"
        >
          New Workflow
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-3">
        {workflows.map((w) => (
          <WorkflowListItem
            key={w.id}
            workflow={w}
            onDelete={() => handleDelete(w.id)}
          />
        ))}
      </div>
    </div>
  );
}
