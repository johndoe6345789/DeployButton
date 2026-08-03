"use client";

import { useTranslations } from "next-intl";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { EditableStep } from "@/types";
import styles from "./StepCardHeader.module.scss";

export default function StepCardHeader({
  step,
  typeLabel,
  expanded,
  onNameChange,
  onToggleExpanded,
  onRemove,
  dragHandleProps,
}: {
  step: EditableStep;
  typeLabel: string;
  expanded: boolean;
  onNameChange: (name: string) => void;
  onToggleExpanded: () => void;
  onRemove: () => void;
  dragHandleProps: Record<string, unknown>;
}) {
  const t = useTranslations("workflowEditor");

  return (
    <div className={styles.header} data-testid="step-card-header">
      <div className={styles.nameRow}>
        <IconButton
          {...dragHandleProps}
          size="small"
          aria-label={t("dragToReorder")}
          data-testid="step-drag-handle"
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
        <TextField
          size="small"
          variant="standard"
          fullWidth
          value={step.name}
          onChange={(e) => onNameChange(e.target.value)}
          slotProps={{ htmlInput: { "data-testid": "step-name-input" } }}
        />
      </div>
      <div className={styles.actions}>
        <Chip size="small" label={typeLabel} data-testid="step-type-chip" />
        <Button
          size="small"
          onClick={onToggleExpanded}
          data-testid="step-toggle-configure"
        >
          {expanded ? t("collapse") : t("configure")}
        </Button>
        <Button
          size="small"
          color="error"
          onClick={onRemove}
          data-testid="step-remove"
        >
          {t("remove")}
        </Button>
      </div>
    </div>
  );
}
