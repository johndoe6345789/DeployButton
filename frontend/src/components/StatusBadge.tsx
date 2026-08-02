type Status = "running" | "success" | "failed" | "skipped" | null | undefined;

const STYLES: Record<string, string> = {
  running: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  skipped: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  none: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
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
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[key]}`}
    >
      {LABELS[key]}
    </span>
  );
}
