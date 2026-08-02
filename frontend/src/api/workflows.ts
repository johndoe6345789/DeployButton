import type { Workflow, WorkflowWithSteps } from "@/types";
import { request } from "./http";

export const workflowsApi = {
  list: () => request<Workflow[]>("/api/workflows"),
  get: (id: number) => request<WorkflowWithSteps>(`/api/workflows/${id}`),
  create: (data: { name: string; description: string }) =>
    request<WorkflowWithSteps>("/api/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: { name: string; description: string }) =>
    request<WorkflowWithSteps>(`/api/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/api/workflows/${id}`, { method: "DELETE" }),
  updateSteps: (
    id: number,
    steps: { name: string; type: string; config: Record<string, unknown> }[],
  ) =>
    request<WorkflowWithSteps>(`/api/workflows/${id}/steps`, {
      method: "PUT",
      body: JSON.stringify(steps),
    }),
};
