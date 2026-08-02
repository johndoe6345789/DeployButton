"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <TextField
        select
        size="small"
        slotProps={{ select: { native: true } }}
        value={type}
        onChange={(e) => setType(e.target.value as StepType)}
      >
        {STEP_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </TextField>
      <Button
        variant="contained"
        onClick={() =>
          onAdd({
            key: crypto.randomUUID(),
            name: defaultName(type),
            type,
            config: defaultConfig(type),
          })
        }
      >
        Add Step
      </Button>
    </Stack>
  );
}
