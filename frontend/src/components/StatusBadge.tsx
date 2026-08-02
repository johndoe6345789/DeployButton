import { useTranslations } from "next-intl";
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

type Status = "running" | "success" | "failed" | "skipped" | null | undefined;

const COLORS: Record<string, ChipProps["color"]> = {
  running: "info",
  success: "success",
  failed: "error",
  skipped: "default",
  none: "default",
};

export default function StatusBadge({ status }: { status: Status }) {
  const t = useTranslations("statusBadge");
  const key = status ?? "none";
  return (
    <Chip
      size="small"
      color={COLORS[key]}
      label={t(key)}
      data-testid="status-badge"
    />
  );
}
