"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./DashboardHeader.module.scss";

export default function DashboardHeader({
  onNewProject,
}: {
  onNewProject: () => void;
}) {
  const t = useTranslations("dashboard");

  return (
    <header className={styles.header}>
      <div>
        <Typography variant="h4" className={styles.title}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("subtitle")}
        </Typography>
      </div>
      <div className={styles.actions}>
        <Button component={Link} href="/workflows" color="inherit">
          {t("workflowsLink")}
        </Button>
        <Button
          variant="contained"
          onClick={onNewProject}
          data-testid="new-project-button"
        >
          {t("newProject")}
        </Button>
      </div>
    </header>
  );
}
