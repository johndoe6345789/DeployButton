"use client";

import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function HttpWebhookFields({ config, onChange }: FieldsProps) {
  const t = useTranslations("stepFields");

  return (
    <Stack spacing={1.5}>
      <TextField
        size="small"
        fullWidth
        label={t("url")}
        value={config.url ?? ""}
        onChange={(e) => onChange(set(config, "url", e.target.value))}
        placeholder={t("urlPlaceholder")}
      />
      <TextField
        select
        size="small"
        fullWidth
        label={t("method")}
        slotProps={{ select: { native: true } }}
        value={config.method ?? "POST"}
        onChange={(e) => onChange(set(config, "method", e.target.value))}
      >
        <option value="POST">POST</option>
        <option value="GET">GET</option>
        <option value="PUT">PUT</option>
      </TextField>
      <TextField
        size="small"
        fullWidth
        multiline
        rows={2}
        label={t("body")}
        value={config.body ?? ""}
        onChange={(e) => onChange(set(config, "body", e.target.value))}
      />
    </Stack>
  );
}
