"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Paper from "@mui/material/Paper";
import type { EditableStep } from "@/types";
import StepCardHeader from "./StepCardHeader";
import StepConfigForm from "./StepConfigForm";
import styles from "./StepCard.module.scss";

export default function StepCard({
  step,
  onChange,
  onRemove,
}: {
  step: EditableStep;
  onChange: (step: EditableStep) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("stepTypes");
  const [expanded, setExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeLabel = t.has(step.type) ? t(step.type) : step.type;

  return (
    <Paper ref={setNodeRef} style={style} variant="outlined">
      <StepCardHeader
        step={step}
        typeLabel={typeLabel}
        expanded={expanded}
        onNameChange={(name) => onChange({ ...step, name })}
        onToggleExpanded={() => setExpanded((v) => !v)}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
      {expanded && (
        <div className={styles.body}>
          <StepConfigForm
            type={step.type}
            config={step.config}
            onChange={(config) => onChange({ ...step, config })}
          />
        </div>
      )}
    </Paper>
  );
}
