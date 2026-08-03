"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import StatusBadge from "./StatusBadge";
import type { WorkflowRun } from "@/types";
import styles from "./RunHistoryRow.module.scss";

export default function RunHistoryRow({ run }: { run: WorkflowRun }) {
  const t = useTranslations("runHistory");

  return (
    <Paper
      component={Link}
      href={`/runs/${run.id}`}
      variant="outlined"
      className={styles.row}
      data-testid="run-history-row"
    >
      <div className={styles.meta}>
        <StatusBadge status={run.status} />
        <Typography variant="body2" color="text.secondary">
          {run.trigger_type === "manual"
            ? t("manual")
            : t("githubWebhook")}
        </Typography>
      </div>
      <Typography variant="body2" color="text.secondary">
        {run.started_at}
      </Typography>
    </Paper>
  );
}
