"use client";

import AddStepMenu from "./AddStepMenu";
import type { EditableStep } from "@/types";

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
  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <input
          className="rounded-md border border-black/20 px-2 py-1 text-xl font-bold dark:border-white/20 dark:bg-neutral-800"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <textarea
          className="rounded-md border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-neutral-800"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          placeholder="Description"
        />
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Steps</h2>
        <AddStepMenu onAdd={onAddStep} />
      </div>
    </>
  );
}
