"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageContainer from "@/components/PageContainer";
import RunStepItem from "@/components/RunStepItem";
import StatusBadge from "@/components/StatusBadge";
import { useRunPolling } from "@/hooks/useRunPolling";

export default function RunDetailPage() {
  const params = useParams<{ id: string }>();
  const runId = Number(params.id);
  const { run, error } = useRunPolling(runId);

  return (
    <PageContainer>
      <Typography
        component={Link}
        href={run ? `/projects/${run.project_id}/runs` : "/"}
        variant="body2"
        sx={{ color: "primary.main" }}
      >
        &larr; Back to run history
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", mt: 1 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Run #{runId}
        </Typography>
        {run && <StatusBadge status={run.status} />}
      </Stack>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      {!run && !error && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      )}

      <Stack spacing={1.5} sx={{ mt: 3 }}>
        {run?.step_runs.map((step) => (
          <RunStepItem key={step.id} step={step} />
        ))}
      </Stack>
    </PageContainer>
  );
}
