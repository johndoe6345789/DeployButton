"use client";

import { Field, inputClass, set, type FieldsProps } from "./shared";

export default function NotifyFields({ config, onChange }: FieldsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Field label="Message">
        <input
          className={inputClass}
          value={config.message ?? ""}
          onChange={(e) => onChange(set(config, "message", e.target.value))}
        />
      </Field>
      <Field label="Webhook URL (optional)">
        <input
          className={inputClass}
          value={config.webhookUrl ?? ""}
          onChange={(e) => onChange(set(config, "webhookUrl", e.target.value))}
        />
      </Field>
    </div>
  );
}
