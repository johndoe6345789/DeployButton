import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import type { EditableStep, WorkflowStep } from "@/types";

export function errorMessage(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback;
}

export function toEditableSteps(steps: WorkflowStep[]): EditableStep[] {
  return steps.map((s) => ({
    key: String(s.id),
    name: s.name,
    type: s.type,
    config: s.config,
  }));
}

export function reorderOnDragEnd(
  items: EditableStep[],
  event: DragEndEvent,
): EditableStep[] {
  const { active, over } = event;
  if (!over || active.id === over.id) return items;
  const oldIndex = items.findIndex((i) => i.key === active.id);
  const newIndex = items.findIndex((i) => i.key === over.id);
  return arrayMove(items, oldIndex, newIndex);
}
