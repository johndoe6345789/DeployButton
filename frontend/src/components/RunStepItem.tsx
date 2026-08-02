"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StatusBadge from "./StatusBadge";
import type { StepRun } from "@/types";

export default function RunStepItem({ step }: { step: StepRun }) {
  return (
    <Paper variant="outlined">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          borderBottom: 1,
          borderColor: "divider",
          px: 2,
          py: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {step.name}
        </Typography>
        <StatusBadge status={step.status} />
      </Stack>
      {step.output && (
        <Box
          component="pre"
          sx={{
            maxHeight: 256,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            m: 0,
            p: 1.5,
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          {step.output}
        </Box>
      )}
    </Paper>
  );
}
