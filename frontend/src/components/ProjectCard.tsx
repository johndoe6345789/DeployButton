import Link from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { Project } from "@/types";
import StatusBadge from "./StatusBadge";
import DeployButton from "./DeployButton";

function relativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso.replace(" ", "T") + "Z");
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ProjectCard({ project }: { project: Project }) {
  const lastRunTime =
    relativeTime(project.last_run_finished_at) ??
    relativeTime(project.last_run_started_at);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { sm: "center" },
            justifyContent: { sm: "space-between" },
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexWrap: "wrap" }}
            >
              <Typography
                component={Link}
                href={`/projects/${project.id}/runs`}
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  textDecoration: "none",
                }}
              >
                {project.name}
              </Typography>
              <StatusBadge status={project.last_run_status} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {project.workflow_name}
              {lastRunTime ? ` · last run ${lastRunTime}` : ""}
            </Typography>
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              alignSelf: { xs: "flex-start", sm: "auto" },
            }}
          >
            <DeployButton projectId={project.id} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
