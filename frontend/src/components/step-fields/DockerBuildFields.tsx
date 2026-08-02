"use client";

import { Field, inputClass, set, type FieldsProps } from "./shared";

export default function DockerBuildFields({ config, onChange }: FieldsProps) {
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
      <Field label="Image tag">
        <input
          className={inputClass}
          value={config.tag ?? ""}
          onChange={(e) => onChange(set(config, "tag", e.target.value))}
          placeholder="my-app:latest"
        />
      </Field>
      <Field label="Dockerfile">
        <input
          className={inputClass}
          value={config.dockerfile ?? "Dockerfile"}
          onChange={(e) => onChange(set(config, "dockerfile", e.target.value))}
        />
      </Field>
    </div>
  );
}
