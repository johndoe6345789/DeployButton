"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function DockerBuildFields({ config, onChange }: FieldsProps) {
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
        label="Image tag"
        value={config.tag ?? ""}
        onChange={(e) => onChange(set(config, "tag", e.target.value))}
        placeholder="my-app:latest"
      />
      <TextField
        size="small"
        fullWidth
        label="Dockerfile"
        value={config.dockerfile ?? "Dockerfile"}
        onChange={(e) => onChange(set(config, "dockerfile", e.target.value))}
      />
    </Stack>
  );
}
