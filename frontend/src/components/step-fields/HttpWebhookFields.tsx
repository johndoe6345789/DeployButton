"use client";

import { Field, inputClass, set, type FieldsProps } from "./shared";

export default function HttpWebhookFields({ config, onChange }: FieldsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Field label="URL">
        <input
          className={inputClass}
          value={config.url ?? ""}
          onChange={(e) => onChange(set(config, "url", e.target.value))}
          placeholder="https://captain.example.com/.../triggerbuild?token=..."
        />
      </Field>
      <Field label="Method">
        <select
          className={inputClass}
          value={config.method ?? "POST"}
          onChange={(e) => onChange(set(config, "method", e.target.value))}
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>
      </Field>
      <Field label="Body (optional)">
        <textarea
          className={inputClass}
          value={config.body ?? ""}
          onChange={(e) => onChange(set(config, "body", e.target.value))}
          rows={2}
        />
      </Field>
    </div>
  );
}
