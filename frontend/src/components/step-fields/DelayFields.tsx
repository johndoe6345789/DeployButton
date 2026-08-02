"use client";

import { useTranslations } from "next-intl";
import TextField from "@mui/material/TextField";
import { set, type FieldsProps } from "./shared";

export default function DelayFields({ config, onChange }: FieldsProps) {
  const t = useTranslations("stepFields");

  return (
    <TextField
      type="number"
      size="small"
      fullWidth
      label={t("seconds")}
      value={config.seconds ?? 0}
      onChange={(e) =>
        onChange(set(config, "seconds", Number(e.target.value)))
      }
    />
  );
}
