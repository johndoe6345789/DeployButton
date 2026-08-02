"use client";

import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function DockerBuildFields({ config, onChange }: FieldsProps) {
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
      <TextField
        size="small"
        fullWidth
        label={t("imageTag")}
        value={config.tag ?? ""}
        onChange={(e) => onChange(set(config, "tag", e.target.value))}
        placeholder={t("imageTagPlaceholder")}
      />
      <TextField
        size="small"
        fullWidth
        label={t("dockerfile")}
        value={config.dockerfile ?? "Dockerfile"}
        onChange={(e) => onChange(set(config, "dockerfile", e.target.value))}
      />
    </Stack>
  );
}
