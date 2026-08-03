"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./WorkflowsListHeader.module.scss";

export default function WorkflowsListHeader({
  onCreate,
}: {
  onCreate: () => void;
}) {
  const t = useTranslations("workflowsList");

  return (
    <header className={styles.header}>
      <div>
        <Typography variant="h4" className={styles.title}>
          {t("title")}
        </Typography>
        <Typography
          component={Link}
          href="/"
          variant="body2"
          className={styles.backLink}
        >
          &larr; {t("backToDashboard")}
        </Typography>
      </div>
      <Button
        variant="contained"
        onClick={onCreate}
        className={styles.createButton}
        data-testid="new-workflow-button"
      >
        {t("newWorkflow")}
      </Button>
    </header>
  );
}
