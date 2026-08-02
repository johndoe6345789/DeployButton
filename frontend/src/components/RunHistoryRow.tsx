"use client";

import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import StatusBadge from "./StatusBadge";
import type { WorkflowRun } from "@/types";

export default function RunHistoryRow({ run }: { run: WorkflowRun }) {
  return (
    <Paper
      component={Link}
      href={`/runs/${run.id}`}
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        justifyContent: { sm: "space-between" },
        gap: 1,
        p: 1.5,
        textDecoration: "none",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        <StatusBadge status={run.status} />
        <Typography variant="body2" color="text.secondary">
          {run.trigger_type === "manual" ? "Manual" : "GitHub webhook"}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {run.started_at}
      </Typography>
    </Paper>
  );
}
