"use client";

import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function GitPullFields({ config, onChange }: FieldsProps) {
  return (
    <TextField
      size="small"
      fullWidth
      label="Working directory"
      value={config.cwd ?? ""}
      onChange={(e) => onChange(set(config, "cwd", e.target.value))}
      placeholder="/srv/repos/my-app"
    />
  );
}
