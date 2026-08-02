"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import type { EditableStep, StepType } from "@/types";
import { STEP_TYPES } from "@/types";
import styles from "./AddStepMenu.module.scss";

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
  const t = useTranslations("stepTypes");
  const tEditor = useTranslations("workflowEditor");
  const [type, setType] = useState<StepType>("shell");

  return (
    <div className={styles.menu}>
      <TextField
        select
        size="small"
        slotProps={{ select: { native: true } }}
        value={type}
        onChange={(e) => setType(e.target.value as StepType)}
        data-testid="add-step-type"
      >
        {STEP_TYPES.map((s) => (
          <option key={s.value} value={s.value}>
            {t(s.value)}
          </option>
        ))}
      </TextField>
      <Button
        variant="contained"
        data-testid="add-step-button"
        onClick={() =>
          onAdd({
            key: crypto.randomUUID(),
            name: t(type),
            type,
            config: defaultConfig(type),
          })
        }
      >
        {tEditor("addStep")}
      </Button>
    </div>
  );
}
