"use client";

import { useTranslations } from "next-intl";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function GitPullFields({ config, onChange }: FieldsProps) {
  const t = useTranslations("stepFields");

  return (
    <TextField
      size="small"
      fullWidth
      label={t("workingDirectory")}
      value={config.cwd ?? ""}
      onChange={(e) => onChange(set(config, "cwd", e.target.value))}
      placeholder={t("workingDirectoryPlaceholder")}
    />
  );
}
