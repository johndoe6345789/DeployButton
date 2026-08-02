"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { EditableStep } from "@/types";
import { STEP_TYPES } from "@/types";
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeLabel = STEP_TYPES.find((t) => t.value === step.type)?.label ?? step.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900"
    >
      <div className="flex items-center gap-2 p-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab px-1 text-gray-400 active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>
        <input
          className="flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium hover:border-black/10 focus:border-black/20 dark:hover:border-white/10"
          value={step.name}
          onChange={(e) => onChange({ ...step, name: e.target.value })}
        />
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
          {typeLabel}
        </span>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-gray-500 hover:underline"
        >
          {expanded ? "Collapse" : "Configure"}
        </button>
        <button
          onClick={onRemove}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
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
