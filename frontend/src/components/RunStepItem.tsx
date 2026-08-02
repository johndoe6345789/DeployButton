"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import StatusBadge from "./StatusBadge";
import type { StepRun } from "@/types";
import styles from "./RunStepItem.module.scss";

export default function RunStepItem({ step }: { step: StepRun }) {
  return (
    <Paper variant="outlined" data-testid="run-step-item">
      <div className={styles.header}>
        <Typography variant="body2" className={styles.name}>
          {step.name}
        </Typography>
        <StatusBadge status={step.status} />
      </div>
      {step.output && (
        <pre className={styles.output}>{step.output}</pre>
      )}
    </Paper>
  );
}
