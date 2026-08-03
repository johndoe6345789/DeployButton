"use client";

import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function NotifyFields({ config, onChange }: FieldsProps) {
  const t = useTranslations("stepFields");

  return (
    <Stack spacing={1.5}>
      <TextField
        size="small"
        fullWidth
        label={t("message")}
        value={config.message ?? ""}
        onChange={(e) => onChange(set(config, "message", e.target.value))}
      />
      <TextField
        size="small"
        fullWidth
        label={t("webhookUrl")}
        value={config.webhookUrl ?? ""}
        onChange={(e) => onChange(set(config, "webhookUrl", e.target.value))}
      />
    </Stack>
  );
}
