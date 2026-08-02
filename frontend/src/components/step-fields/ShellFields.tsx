"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function ShellFields({ config, onChange }: FieldsProps) {
  return (
    <Stack spacing={1.5}>
      <TextField
        size="small"
        fullWidth
        label="Working directory"
        value={config.cwd ?? ""}
        onChange={(e) => onChange(set(config, "cwd", e.target.value))}
        placeholder="/srv/repos/my-app"
      />
      <TextField
        size="small"
        fullWidth
        label="Command"
        value={config.command ?? ""}
        onChange={(e) => onChange(set(config, "command", e.target.value))}
        placeholder="echo hello"
      />
    </Stack>
  );
}
