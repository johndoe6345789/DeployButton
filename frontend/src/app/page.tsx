"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageContainer from "@/components/PageContainer";
import DashboardHeader from "@/components/DashboardHeader";
import ProjectCard from "@/components/ProjectCard";
import NewProjectModal from "@/components/NewProjectModal";
import { useProjects } from "@/hooks/useProjects";

export default function Dashboard() {
  const { projects, loading, error, refresh } = useProjects();
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <PageContainer>
      <DashboardHeader onNewProject={() => setShowNewProject(true)} />

      {loading && (
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}

      {!loading && projects.length === 0 && !error && (
        <Typography variant="body2" color="text.secondary">
          No projects yet. Create one to get started.
        </Typography>
      )}

      <Stack spacing={1.5}>
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </Stack>

      {showNewProject && (
        <NewProjectModal
          onClose={() => setShowNewProject(false)}
          onCreated={() => {
            setShowNewProject(false);
            refresh();
          }}
        />
      )}
    </PageContainer>
  );
}
