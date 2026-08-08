export type StepType =
  | "git_pull"
  | "shell"
  | "npm_install"
  | "npm_build"
  | "docker_build"
  | "http_webhook"
  | "blue_green_deploy"
  | "delay"
  | "notify";

export const STEP_TYPES: { value: StepType; label: string }[] = [
  { value: "git_pull", label: "Git pull" },
  { value: "shell", label: "Shell command" },
  { value: "npm_install", label: "Install dependencies" },
  { value: "npm_build", label: "Build (npm/yarn/pnpm)" },
  { value: "docker_build", label: "Docker build" },
  { value: "http_webhook", label: "HTTP webhook call" },
  { value: "blue_green_deploy", label: "Blue/green self-deploy" },
  { value: "delay", label: "Delay" },
  { value: "notify", label: "Notify" },
];

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

// A step as edited client-side in the Workflow Designer, before being
// saved. `key` is a stable local identifier (existing step id, or a
// generated one for new steps) used for React keys and drag-and-drop --
// it is never sent to the API.
export interface EditableStep {
  key: string;
  name: string;
  type: StepType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
}
