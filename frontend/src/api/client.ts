import type {
  Project,
  RunDetail,
  Workflow,
  WorkflowRun,
  WorkflowWithSteps,
} from "@/types";

// In production, nginx routes same-origin /api/* to the backend, so this is
// left empty. For local `next dev` (no nginx in front), point it at the
// backend directly via NEXT_PUBLIC_API_BASE, e.g. http://localhost:8080.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export const api = {
  listProjects: () => request<Project[]>("/api/projects"),
  getProject: (id: number) => request<Project>(`/api/projects/${id}`),
  createProject: (data: {
    name: string;
    slug: string;
    repo_url: string;
    workflow_id: number;
  }) =>
    request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProject: (
    id: number,
    data: { name: string; slug: string; repo_url: string; workflow_id: number },
  ) =>
    request<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<void>(`/api/projects/${id}`, { method: "DELETE" }),

  listWorkflows: () => request<Workflow[]>("/api/workflows"),
  getWorkflow: (id: number) =>
    request<WorkflowWithSteps>(`/api/workflows/${id}`),
  createWorkflow: (data: { name: string; description: string }) =>
    request<WorkflowWithSteps>("/api/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateWorkflow: (id: number, data: { name: string; description: string }) =>
    request<WorkflowWithSteps>(`/api/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteWorkflow: (id: number) =>
    request<void>(`/api/workflows/${id}`, { method: "DELETE" }),
  updateWorkflowSteps: (
    id: number,
    steps: { name: string; type: string; config: Record<string, unknown> }[],
  ) =>
    request<WorkflowWithSteps>(`/api/workflows/${id}/steps`, {
      method: "PUT",
      body: JSON.stringify(steps),
    }),

  deploy: (projectId: number) =>
    request<{ runId: number }>(`/api/projects/${projectId}/deploy`, {
      method: "POST",
    }),
  listRuns: (projectId: number) =>
    request<WorkflowRun[]>(`/api/projects/${projectId}/runs`),
  getRun: (runId: number) => request<RunDetail>(`/api/runs/${runId}`),
};
