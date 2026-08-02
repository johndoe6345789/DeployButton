"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import type { Project } from "@/types";
import styles from "./RunHistoryHeader.module.scss";

export default function RunHistoryHeader({
  project,
}: {
  project: Project | null;
}) {
  const t = useTranslations("runHistory");

  return (
    <>
      <Typography
        component={Link}
        href="/"
        variant="body2"
        className={styles.backLink}
        data-testid="back-to-dashboard"
      >
        &larr; {t("backToDashboard")}
      </Typography>

      <Typography variant="h4" className={styles.title}>
        {project
          ? t("titleWithProject", { name: project.name })
          : t("title")}
      </Typography>
    </>
  );
}
