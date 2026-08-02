"use client";

export function ModalFooter({
  onCancel,
  submitting,
  submitLabel = "Create",
  submittingLabel = "Creating...",
}: {
  onCancel: () => void;
  submitting: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </div>
  );
}
