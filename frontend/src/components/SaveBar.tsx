"use client";

export default function SaveBar({
  saving,
  saved,
  error,
  onSave,
  onDone,
}: {
  saving: boolean;
  saved: boolean;
  error: string | null;
  onSave: () => void;
  onDone: () => void;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
      {saved && <span className="text-sm text-green-600">Saved.</span>}
      {error && <span className="text-sm text-red-600">{error}</span>}
      <button
        onClick={onDone}
        className="text-sm text-gray-500 hover:underline"
      >
        Done
      </button>
    </div>
  );
}
