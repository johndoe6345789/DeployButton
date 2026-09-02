"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import { api } from "@/api/client";
import type { Project } from "@/types";
import { useRunListPolling } from "@/hooks/useRunListPolling";
import PageContainer from "@/components/PageContainer";
import RunHistoryHeader from "@/components/RunHistoryHeader";
import RunHistoryRow from "@/components/RunHistoryRow";
import styles from "./page.module.scss";

export default function RunHistory() {
  const t = useTranslations("runHistory");
  const tc = useTranslations("common");
  const params = useParams<{ id: string }>();
  const projectId = Number(params.id);

  const failedToLoadMessage = tc("failedToLoad");
  const [project, setProject] = useState<Project | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const { runs, error: runsError } = useRunListPolling(projectId);

  useEffect(() => {
    api
      .getProject(projectId)
      .then(setProject)
      .catch((e) =>
        setProjectError(e instanceof Error ? e.message : failedToLoadMessage),
      );
  }, [projectId, failedToLoadMessage]);

  const error = projectError ?? runsError;
  const loading = runs === null && error === null;

  return (
    <PageContainer>
      <RunHistoryHeader project={project} projectId={projectId} />

      {loading && (
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.message}
        >
          {tc("loading")}
        </Typography>
      )}
      {error && (
        <Typography
          variant="body2"
          color="error"
          className={styles.message}
          data-testid="run-history-error"
        >
          {error}
        </Typography>
      )}
      {runs?.length === 0 && !error && (
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.message}
        >
          {t("noRuns")}
        </Typography>
      )}

      <div className={styles.runs} data-testid="run-history-list">
        {runs?.map((run) => <RunHistoryRow key={run.id} run={run} />)}
      </div>
    </PageContainer>
  );
}
