"use client";

import {
  Field,
  ManagerSelect,
  inputClass,
  set,
  type FieldsProps,
} from "./shared";

export default function NpmBuildFields({ config, onChange }: FieldsProps) {
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
      <ManagerSelect
        value={config.manager ?? "npm"}
        onChange={(value) => onChange(set(config, "manager", value))}
      />
      <Field label="Script">
        <input
          className={inputClass}
          value={config.script ?? "build"}
          onChange={(e) => onChange(set(config, "script", e.target.value))}
        />
      </Field>
    </div>
  );
}
