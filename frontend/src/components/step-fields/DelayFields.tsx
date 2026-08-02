"use client";

import { Field, inputClass, set, type FieldsProps } from "./shared";

export default function DelayFields({ config, onChange }: FieldsProps) {
  return (
    <Field label="Seconds">
      <input
        type="number"
        className={inputClass}
        value={config.seconds ?? 0}
        onChange={(e) =>
          onChange(set(config, "seconds", Number(e.target.value)))
        }
      />
    </Field>
  );
}
