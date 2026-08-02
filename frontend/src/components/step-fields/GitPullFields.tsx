"use client";

import { Field, inputClass, set, type FieldsProps } from "./shared";

export default function GitPullFields({ config, onChange }: FieldsProps) {
  return (
    <Field label="Working directory">
      <input
        className={inputClass}
        value={config.cwd ?? ""}
        onChange={(e) => onChange(set(config, "cwd", e.target.value))}
        placeholder="/srv/repos/my-app"
      />
    </Field>
  );
}
