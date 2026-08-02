"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config = Record<string, any>;

export interface FieldsProps {
  config: Config;
  onChange: (config: Config) => void;
}

export const inputClass =
  "rounded-md border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-neutral-800";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      {children}
    </label>
  );
}

export function set(config: Config, key: string, value: unknown): Config {
  return { ...config, [key]: value };
}

export function ManagerSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label="Package manager">
      <select
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="npm">npm</option>
        <option value="yarn">yarn</option>
        <option value="pnpm">pnpm</option>
      </select>
    </Field>
  );
}
