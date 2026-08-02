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
  const sensors = useSensors(useSensor(PointerSensor));

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
          <div className="mt-3 flex flex-col gap-2">
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
        <p className="mt-4 text-sm text-gray-500">
          No steps yet. Add one above.
        </p>
      )}
    </>
  );
}
