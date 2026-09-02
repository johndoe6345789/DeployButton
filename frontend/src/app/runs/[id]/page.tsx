"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import PageContainer from "@/components/PageContainer";
import RunStepItem from "@/components/RunStepItem";
import StatusBadge from "@/components/StatusBadge";
import { useRunPolling } from "@/hooks/useRunPolling";
import { useAutoScrollToBottom } from "@/hooks/useAutoScrollToBottom";
import styles from "./page.module.scss";

export default function RunDetailPage() {
  const t = useTranslations("runDetail");
  const tc = useTranslations("common");
  const params = useParams<{ id: string }>();
  const runId = Number(params.id);
  const { run, error } = useRunPolling(runId);
  useAutoScrollToBottom(run, run?.status === "running");

  return (
    <PageContainer>
      <Typography
        component={Link}
        href={run ? `/projects/${run.project_id}/runs` : "/"}
        variant="body2"
        className={styles.backLink}
        data-testid="back-to-run-history"
      >
        &larr; {t("backToRunHistory")}
      </Typography>

      <div className={styles.titleRow}>
        <Typography variant="h4" className={styles.title}>
          {t("runNumber", { id: runId })}
        </Typography>
        {run && <StatusBadge status={run.status} />}
      </div>

      {error && (
        <Typography
          variant="body2"
          color="error"
          className={styles.message}
          data-testid="run-detail-error"
        >
          {error}
        </Typography>
      )}
      {!run && !error && (
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.message}
        >
          {tc("loading")}
        </Typography>
      )}

      <div className={styles.steps} data-testid="run-steps">
        {run?.step_runs.map((step) => (
          <RunStepItem key={step.id} step={step} />
        ))}
      </div>
    </PageContainer>
  );
}
