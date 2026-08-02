"use client";

import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function DelayFields({ config, onChange }: FieldsProps) {
  return (
    <TextField
      type="number"
      size="small"
      fullWidth
      label="Seconds"
      value={config.seconds ?? 0}
      onChange={(e) =>
        onChange(set(config, "seconds", Number(e.target.value)))
      }
    />
  );
}
