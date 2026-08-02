"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function NotifyFields({ config, onChange }: FieldsProps) {
  return (
    <Stack spacing={1.5}>
      <TextField
        size="small"
        fullWidth
        label="Message"
        value={config.message ?? ""}
        onChange={(e) => onChange(set(config, "message", e.target.value))}
      />
      <TextField
        size="small"
        fullWidth
        label="Webhook URL (optional)"
        value={config.webhookUrl ?? ""}
        onChange={(e) => onChange(set(config, "webhookUrl", e.target.value))}
      />
    </Stack>
  );
}
