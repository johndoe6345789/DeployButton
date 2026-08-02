"use client";

import Link from "next/link";
import type { Workflow } from "@/types";

export default function WorkflowListItem({
  workflow,
  onDelete,
}: {
  workflow: Workflow;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div>
        <div className="flex items-center gap-2">
          <Link
            href={`/workflows/${workflow.id}`}
            className="font-semibold hover:underline"
          >
            {workflow.name}
          </Link>
          {workflow.is_template && (
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
              Template
            </span>
          )}
        </div>
        {workflow.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {workflow.description}
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="text-xs text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
