"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import TextField from "@mui/material/TextField";
import { setLocale } from "@/i18n/actions";
import { LOCALES } from "@/i18n/locales";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <TextField
      select
      size="small"
      slotProps={{ select: { native: true } }}
      label={t("label")}
      value={locale}
      disabled={pending}
      data-testid="language-switcher"
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          await setLocale(next);
          router.refresh();
        });
      }}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {t(l)}
        </option>
      ))}
    </TextField>
  );
}
