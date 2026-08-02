import type { StepType } from "./workflow";

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
