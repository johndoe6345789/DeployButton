import type { Project } from "@/types";
import { request } from "./http";

export const projectsApi = {
  list: () => request<Project[]>("/api/projects"),
  get: (id: number) => request<Project>(`/api/projects/${id}`),
  create: (data: {
    name: string;
    slug: string;
    repo_url: string;
    workflow_id: number;
  }) =>
    request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: { name: string; slug: string; repo_url: string; workflow_id: number },
  ) =>
    request<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/api/projects/${id}`, { method: "DELETE" }),
  deploy: (id: number) =>
    request<{ runId: number }>(`/api/projects/${id}/deploy`, {
      method: "POST",
    }),
};
