"use client";

import { useState } from "react";
import type { EditableStep, StepType } from "@/types";
import { STEP_TYPES } from "@/types";

function defaultName(type: StepType): string {
  return STEP_TYPES.find((t) => t.value === type)?.label ?? type;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defaultConfig(type: StepType): Record<string, any> {
  switch (type) {
    case "npm_install":
      return { manager: "npm" };
    case "npm_build":
      return { manager: "npm", script: "build" };
    case "http_webhook":
      return { method: "POST" };
    case "delay":
      return { seconds: 5 };
    case "docker_build":
      return { dockerfile: "Dockerfile" };
    default:
      return {};
  }
}

export default function AddStepMenu({
  onAdd,
}: {
  onAdd: (step: EditableStep) => void;
}) {
  const [type, setType] = useState<StepType>("shell");

  return (
    <div className="flex items-center gap-2">
      <select
        className="rounded-md border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-neutral-800"
        value={type}
        onChange={(e) => setType(e.target.value as StepType)}
      >
        {STEP_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          onAdd({
            key: crypto.randomUUID(),
            name: defaultName(type),
            type,
            config: defaultConfig(type),
          })
        }
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Add Step
      </button>
    </div>
  );
}
