"use client";

import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ManagerSelect, set, type FieldsProps } from "./shared";

export default function NpmBuildFields({ config, onChange }: FieldsProps) {
  const t = useTranslations("stepFields");

  return (
    <Stack spacing={1.5}>
      <TextField
        size="small"
        fullWidth
        label={t("workingDirectory")}
        value={config.cwd ?? ""}
        onChange={(e) => onChange(set(config, "cwd", e.target.value))}
        placeholder={t("workingDirectoryPlaceholder")}
      />
      <ManagerSelect
        value={config.manager ?? "npm"}
        onChange={(value) => onChange(set(config, "manager", value))}
      />
      <TextField
        size="small"
        fullWidth
        label={t("script")}
        value={config.script ?? "build"}
        onChange={(e) => onChange(set(config, "script", e.target.value))}
      />
    </Stack>
  );
}
