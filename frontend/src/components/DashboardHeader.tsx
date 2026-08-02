"use client";

import Link from "next/link";

export default function DashboardHeader({
  onNewProject,
}: {
  onNewProject: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">DeployButton</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          One-click deploys for your apps.
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          href="/workflows"
          className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
        >
          Workflows
        </Link>
        <button
          onClick={onNewProject}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          New Project
        </button>
      </div>
    </div>
  );
}
