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
