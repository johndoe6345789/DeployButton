"use client";

import { Field, inputClass, set, type FieldsProps } from "./shared";

export default function ShellFields({ config, onChange }: FieldsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Field label="Working directory">
        <input
          className={inputClass}
          value={config.cwd ?? ""}
          onChange={(e) => onChange(set(config, "cwd", e.target.value))}
          placeholder="/srv/repos/my-app"
        />
      </Field>
      <Field label="Command">
        <input
          className={inputClass}
          value={config.command ?? ""}
          onChange={(e) => onChange(set(config, "command", e.target.value))}
          placeholder="echo hello"
        />
      </Field>
    </div>
  );
}
