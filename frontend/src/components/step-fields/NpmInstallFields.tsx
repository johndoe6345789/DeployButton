"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ManagerSelect, set, type FieldsProps } from "./shared";

export default function NpmInstallFields({ config, onChange }: FieldsProps) {
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
      <ManagerSelect
        value={config.manager ?? "npm"}
        onChange={(value) => onChange(set(config, "manager", value))}
      />
    </Stack>
  );
}
