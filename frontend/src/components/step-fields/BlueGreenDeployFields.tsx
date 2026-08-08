"use client";

import { useTranslations } from "next-intl";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function BlueGreenDeployFields({
  config,
  onChange,
}: FieldsProps) {
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
        type="number"
        size="small"
        fullWidth
        label={t("healthTimeoutSeconds")}
        value={config.healthTimeoutSeconds ?? 120}
        onChange={(e) =>
          onChange(set(config, "healthTimeoutSeconds", Number(e.target.value)))
        }
      />
    </Stack>
  );
}
