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

const LABELS: Record<string, string> = {
  running: "Running",
  success: "Success",
  failed: "Failed",
  skipped: "Skipped",
  none: "Never run",
};

export default function StatusBadge({ status }: { status: Status }) {
  const key = status ?? "none";
  return <Chip size="small" color={COLORS[key]} label={LABELS[key]} />;
}
