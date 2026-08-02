"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import type { Workflow } from "@/types";
import styles from "./WorkflowListItem.module.scss";

export default function WorkflowListItem({
  workflow,
  onDelete,
}: {
  workflow: Workflow;
  onDelete: () => void;
}) {
  const t = useTranslations("workflowsList");

  return (
    <Card variant="outlined" data-testid="workflow-list-item">
      <CardContent>
        <div className={styles.row}>
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <Typography
                component={Link}
                href={`/workflows/${workflow.id}`}
                className={styles.name}
              >
                {workflow.name}
              </Typography>
              {workflow.is_template && (
                <Chip size="small" label={t("template")} />
              )}
            </div>
            {workflow.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                className={styles.description}
              >
                {workflow.description}
              </Typography>
            )}
          </div>
          <Button
            size="small"
            color="error"
            onClick={onDelete}
            className={styles.deleteButton}
            data-testid="delete-workflow-button"
          >
            {t("delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
