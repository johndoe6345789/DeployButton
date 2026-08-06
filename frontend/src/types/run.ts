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
  output_length: number;
  exit_code: number | null;
  started_at: string;
  finished_at: string | null;
}

export interface RunDetail extends WorkflowRun {
  step_runs: StepRun[];
}

// A slice of a step's output spanning characters [start_offset, end_offset)
// of the full stored text. See GET /api/step-runs/{id}/output.
export interface StepOutputChunk {
  text: string;
  start_offset: number;
  end_offset: number;
  total_length: number;
}
