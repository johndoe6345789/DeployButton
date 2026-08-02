"use client";

import TextField from "@mui/material/TextField";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config = Record<string, any>;

export interface FieldsProps {
  config: Config;
  onChange: (config: Config) => void;
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
    <TextField
      select
      size="small"
      fullWidth
      label="Package manager"
      slotProps={{ select: { native: true } }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="npm">npm</option>
      <option value="yarn">yarn</option>
      <option value="pnpm">pnpm</option>
    </TextField>
  );
}
