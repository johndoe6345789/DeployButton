"use client";

import type { StepType } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Config = Record<string, any>;

function Field({
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

const inputClass =
  "rounded-md border border-black/20 px-2 py-1 text-sm dark:border-white/20 dark:bg-neutral-800";

export default function StepConfigForm({
  type,
  config,
  onChange,
}: {
  type: StepType;
  config: Config;
  onChange: (config: Config) => void;
}) {
  const set = (key: string, value: unknown) => onChange({ ...config, [key]: value });

  switch (type) {
    case "git_pull":
      return (
        <Field label="Working directory">
          <input
            className={inputClass}
            value={config.cwd ?? ""}
            onChange={(e) => set("cwd", e.target.value)}
            placeholder="/srv/repos/my-app"
          />
        </Field>
      );

    case "shell":
      return (
        <div className="flex flex-col gap-2">
          <Field label="Working directory">
            <input
              className={inputClass}
              value={config.cwd ?? ""}
              onChange={(e) => set("cwd", e.target.value)}
              placeholder="/srv/repos/my-app"
            />
          </Field>
          <Field label="Command">
            <input
              className={inputClass}
              value={config.command ?? ""}
              onChange={(e) => set("command", e.target.value)}
              placeholder="echo hello"
            />
          </Field>
        </div>
      );

    case "npm_install":
      return (
        <div className="flex flex-col gap-2">
          <Field label="Working directory">
            <input
              className={inputClass}
              value={config.cwd ?? ""}
              onChange={(e) => set("cwd", e.target.value)}
              placeholder="/srv/repos/my-app"
            />
          </Field>
          <Field label="Package manager">
            <select
              className={inputClass}
              value={config.manager ?? "npm"}
              onChange={(e) => set("manager", e.target.value)}
            >
              <option value="npm">npm</option>
              <option value="yarn">yarn</option>
              <option value="pnpm">pnpm</option>
            </select>
          </Field>
        </div>
      );

    case "npm_build":
      return (
        <div className="flex flex-col gap-2">
          <Field label="Working directory">
            <input
              className={inputClass}
              value={config.cwd ?? ""}
              onChange={(e) => set("cwd", e.target.value)}
              placeholder="/srv/repos/my-app"
            />
          </Field>
          <Field label="Package manager">
            <select
              className={inputClass}
              value={config.manager ?? "npm"}
              onChange={(e) => set("manager", e.target.value)}
            >
              <option value="npm">npm</option>
              <option value="yarn">yarn</option>
              <option value="pnpm">pnpm</option>
            </select>
          </Field>
          <Field label="Script">
            <input
              className={inputClass}
              value={config.script ?? "build"}
              onChange={(e) => set("script", e.target.value)}
            />
          </Field>
        </div>
      );

    case "docker_build":
      return (
        <div className="flex flex-col gap-2">
          <Field label="Working directory">
            <input
              className={inputClass}
              value={config.cwd ?? ""}
              onChange={(e) => set("cwd", e.target.value)}
              placeholder="/srv/repos/my-app"
            />
          </Field>
          <Field label="Image tag">
            <input
              className={inputClass}
              value={config.tag ?? ""}
              onChange={(e) => set("tag", e.target.value)}
              placeholder="my-app:latest"
            />
          </Field>
          <Field label="Dockerfile">
            <input
              className={inputClass}
              value={config.dockerfile ?? "Dockerfile"}
              onChange={(e) => set("dockerfile", e.target.value)}
            />
          </Field>
        </div>
      );

    case "http_webhook":
      return (
        <div className="flex flex-col gap-2">
          <Field label="URL">
            <input
              className={inputClass}
              value={config.url ?? ""}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://captain.example.com/api/v2/user/apps/webhooks/triggerbuild?namespace=captain&token=..."
            />
          </Field>
          <Field label="Method">
            <select
              className={inputClass}
              value={config.method ?? "POST"}
              onChange={(e) => set("method", e.target.value)}
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
              onChange={(e) => set("body", e.target.value)}
              rows={2}
            />
          </Field>
        </div>
      );

    case "delay":
      return (
        <Field label="Seconds">
          <input
            type="number"
            className={inputClass}
            value={config.seconds ?? 0}
            onChange={(e) => set("seconds", Number(e.target.value))}
          />
        </Field>
      );

    case "notify":
      return (
        <div className="flex flex-col gap-2">
          <Field label="Message">
            <input
              className={inputClass}
              value={config.message ?? ""}
              onChange={(e) => set("message", e.target.value)}
            />
          </Field>
          <Field label="Webhook URL (optional)">
            <input
              className={inputClass}
              value={config.webhookUrl ?? ""}
              onChange={(e) => set("webhookUrl", e.target.value)}
            />
          </Field>
        </div>
      );

    default:
      return null;
  }
}
