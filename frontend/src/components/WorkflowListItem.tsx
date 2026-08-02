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
    <div className="flex flex-col gap-2 rounded-lg border border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/workflows/${workflow.id}`}
            className="truncate font-semibold hover:underline"
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
        className="self-start text-xs text-red-600 hover:underline sm:self-auto"
      >
        Delete
      </button>
    </div>
  );
}
