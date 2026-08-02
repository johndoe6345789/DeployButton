"use client";

import type { EditableStep } from "@/types";

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
  return (
    <div className="flex items-center gap-2 p-2">
      <button
        {...dragHandleProps}
        className="cursor-grab px-1 text-gray-400 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <input
        className="flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium hover:border-black/10 focus:border-black/20 dark:hover:border-white/10"
        value={step.name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
        {typeLabel}
      </span>
      <button
        onClick={onToggleExpanded}
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
  );
}
