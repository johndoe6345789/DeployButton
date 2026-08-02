"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import Typography from "@mui/material/Typography";
import StepCard from "./StepCard";
import type { EditableStep } from "@/types";
import styles from "./StepsList.module.scss";

export default function StepsList({
  steps,
  onDragEnd,
  onChangeStep,
  onRemoveStep,
}: {
  steps: EditableStep[];
  onDragEnd: (event: DragEndEvent) => void;
  onChangeStep: (key: string, updated: EditableStep) => void;
  onRemoveStep: (key: string) => void;
}) {
  const t = useTranslations("workflowEditor");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={steps.map((s) => s.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.list} data-testid="steps-list">
            {steps.map((step) => (
              <StepCard
                key={step.key}
                step={step}
                onChange={(updated) => onChangeStep(step.key, updated)}
                onRemove={() => onRemoveStep(step.key)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {steps.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.empty}
        >
          {t("noSteps")}
        </Typography>
      )}
    </>
  );
}
