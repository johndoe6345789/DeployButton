"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

function subscribeNever() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

export default function ColorModeToggle() {
  const t = useTranslations("common");
  const { mode, systemMode, setMode } = useColorScheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div style={{ width: 40, height: 40 }} />;
  }

  const active = mode === "system" ? systemMode : mode;
  const isDark = active === "dark";

  return (
    <IconButton
      onClick={() => setMode(isDark ? "light" : "dark")}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      data-testid="color-mode-toggle"
    >
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
