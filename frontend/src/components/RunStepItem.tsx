"use client";

import StatusBadge from "./StatusBadge";
import type { StepRun } from "@/types";

export default function RunStepItem({ step }: { step: StepRun }) {
  return (
    <div className="rounded-md border border-black/10 dark:border-white/10">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2 dark:border-white/10">
        <span className="text-sm font-medium">{step.name}</span>
        <StatusBadge status={step.status} />
      </div>
      {step.output && (
        <pre className="max-h-64 overflow-auto whitespace-pre-wrap p-3 text-xs text-gray-700 dark:text-gray-300">
          {step.output}
        </pre>
      )}
    </div>
  );
}
