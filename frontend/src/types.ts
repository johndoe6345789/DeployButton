export type StepType =
  | "git_pull"
  | "shell"
  | "npm_install"
  | "npm_build"
  | "docker_build"
  | "http_webhook"
  | "delay"
  | "notify";

export const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: "git_pull", label: "Git pull" },
  { value: "shell", label: "Shell command" },
  { value: "npm_install", label: "Install dependencies" },
  { value: "npm_build", label: "Build (npm/yarn/pnpm)" },
  { value: "docker_build", label: "Docker build" },
  { value: "http_webhook", label: "HTTP webhook call" },
  { value: "delay", label: "Delay" },
  { value: "notify", label: "Notify" },
];

export interface Project {
  id: number;
  name: string;
  slug: string;
  repo_url: string | null;
  workflow_id: number;
  workflow_name: string;
  last_run_status: "running" | "success" | "failed" | null;
  last_run_started_at: string | null;
  last_run_finished_at: string | null;
}

export interface Workflow {
  id: number;
  name: string;
  description: string | null;
  is_template: boolean;
}

export interface WorkflowStep {
  id: number;
  position: number;
  name: string;
  type: StepType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
}

export interface WorkflowWithSteps extends Workflow {
  steps: WorkflowStep[];
}

// A step as edited client-side in the Workflow Designer, before being saved.
// `key` is a stable local identifier (existing step id, or a generated one for
// new steps) used for React keys and drag-and-drop -- it is never sent to the API.
export interface EditableStep {
  key: string;
  name: string;
  type: StepType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
}

export type RunStatus = "running" | "success" | "failed";

export interface WorkflowRun {
  id: number;
  project_id: number;
  workflow_id: number;
  trigger_type: "manual" | "github_webhook";
  status: RunStatus;
  started_at: string;
  finished_at: string | null;
}

export interface StepRun {
  id: number;
  position: number;
  name: string;
  type: StepType;
  status: RunStatus | "skipped";
  output: string;
  exit_code: number | null;
  started_at: string;
  finished_at: string | null;
}

export interface RunDetail extends WorkflowRun {
  step_runs: StepRun[];
}
