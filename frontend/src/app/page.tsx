"use client";

import { useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import ProjectCard from "@/components/ProjectCard";
import NewProjectModal from "@/components/NewProjectModal";
import { useProjects } from "@/hooks/useProjects";

export default function Dashboard() {
  const { projects, loading, error, refresh } = useProjects();
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <DashboardHeader onNewProject={() => setShowNewProject(true)} />

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
