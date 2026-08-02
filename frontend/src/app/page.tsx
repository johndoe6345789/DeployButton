"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/api/client";
import type { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";
import NewProjectModal from "@/components/NewProjectModal";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);

  function load() {
    api
      .listProjects()
      .then(setProjects)
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
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
            onClick={() => setShowNewProject(true)}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            New Project
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && projects.length === 0 && !error && (
        <p className="text-sm text-gray-500">
          No projects yet. Create one to get started.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {showNewProject && (
        <NewProjectModal
          onClose={() => setShowNewProject(false)}
          onCreated={() => {
            setShowNewProject(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
