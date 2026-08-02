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
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StepCard from "./StepCard";
import type { EditableStep } from "@/types";

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
          <Stack spacing={1} sx={{ mt: 1.5 }}>
            {steps.map((step) => (
              <StepCard
                key={step.key}
                step={step}
                onChange={(updated) => onChangeStep(step.key, updated)}
                onRemove={() => onRemoveStep(step.key)}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      {steps.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No steps yet. Add one above.
        </Typography>
      )}
    </>
  );
}
