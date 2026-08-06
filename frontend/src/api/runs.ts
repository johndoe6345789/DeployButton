import type { RunDetail, StepOutputChunk, WorkflowRun } from "@/types";
import { request } from "./http";

export interface StepOutputParams {
  limit?: number;
  before?: number;
  after?: number;
}

export const runsApi = {
  listForProject: (projectId: number) =>
    request<WorkflowRun[]>(`/api/projects/${projectId}/runs`),
  get: (runId: number) => request<RunDetail>(`/api/runs/${runId}`),
  getStepOutput: (stepRunId: number, params: StepOutputParams = {}) => {
    const query = new URLSearchParams();
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.before !== undefined)
      query.set("before", String(params.before));
    if (params.after !== undefined) query.set("after", String(params.after));
    const qs = query.toString();
    return request<StepOutputChunk>(
      `/api/step-runs/${stepRunId}/output${qs ? `?${qs}` : ""}`,
    );
  },
};
