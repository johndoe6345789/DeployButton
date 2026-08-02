"use client";

export const formInputClass =
  "rounded-md border border-black/20 px-2 py-1 dark:border-white/20 dark:bg-neutral-800";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}
