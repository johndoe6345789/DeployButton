"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EditableStep } from "@/types";
import { STEP_TYPES } from "@/types";
import StepCardHeader from "./StepCardHeader";
import StepConfigForm from "./StepConfigForm";

export default function StepCard({
  step,
  onChange,
  onRemove,
}: {
  step: EditableStep;
  onChange: (step: EditableStep) => void;
  onRemove: () => void;
}) {
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

  const typeLabel =
    STEP_TYPES.find((t) => t.value === step.type)?.label ?? step.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900"
    >
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
        <div className="border-t border-black/10 p-3 dark:border-white/10">
          <StepConfigForm
            type={step.type}
            config={step.config}
            onChange={(config) => onChange({ ...step, config })}
          />
        </div>
      )}
    </div>
  );
}
