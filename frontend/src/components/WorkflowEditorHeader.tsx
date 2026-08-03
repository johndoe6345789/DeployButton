"use client";

import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import AddStepMenu from "./AddStepMenu";
import type { EditableStep } from "@/types";
import styles from "./WorkflowEditorHeader.module.scss";

export default function WorkflowEditorHeader({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  onAddStep,
}: {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onAddStep: (step: EditableStep) => void;
}) {
  const t = useTranslations("workflowEditor");

  return (
    <>
      <div className={styles.nameDescription}>
        <TextField
          variant="standard"
          className={styles.name}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          slotProps={{
            htmlInput: { "data-testid": "workflow-name-input" },
          }}
        />
        <TextField
          size="small"
          multiline
          rows={2}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t("descriptionPlaceholder")}
          slotProps={{
            htmlInput: { "data-testid": "workflow-description-input" },
          }}
        />
      </div>

      <div className={styles.stepsRow}>
        <Typography variant="h6">{t("stepsHeading")}</Typography>
        <AddStepMenu onAdd={onAddStep} />
      </div>
    </>
  );
}
