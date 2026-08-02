"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { api } from "@/api/client";
import type { Project, WorkflowRun } from "@/types";
import PageContainer from "@/components/PageContainer";
import RunHistoryRow from "@/components/RunHistoryRow";

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
    <PageContainer>
      <Typography
        component={Link}
        href="/"
        variant="body2"
        sx={{ color: "primary.main" }}
      >
        &larr; Back to dashboard
      </Typography>

      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
        {project ? `${project.name} — Run History` : "Run History"}
      </Typography>

      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      )}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {!loading && runs.length === 0 && !error && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No runs yet.
        </Typography>
      )}

      <Stack spacing={1} sx={{ mt: 2 }}>
        {runs.map((run) => (
          <RunHistoryRow key={run.id} run={run} />
        ))}
      </Stack>
    </PageContainer>
  );
}
