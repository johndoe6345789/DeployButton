import type { RunDetail, WorkflowRun } from "@/types";
import { request } from "./http";

export const runsApi = {
  listForProject: (projectId: number) =>
    request<WorkflowRun[]>(`/api/projects/${projectId}/runs`),
  get: (runId: number) => request<RunDetail>(`/api/runs/${runId}`),
};
