import { projectsApi } from "./projects";
import { runsApi } from "./runs";
import { workflowsApi } from "./workflows";

// Flat facade over the split per-domain API modules, so components keep a
// single `api.xyz(...)` call surface.
export const api = {
  listProjects: projectsApi.list,
  getProject: projectsApi.get,
  createProject: projectsApi.create,
  updateProject: projectsApi.update,
  deleteProject: projectsApi.delete,
  deploy: projectsApi.deploy,

  listWorkflows: workflowsApi.list,
  getWorkflow: workflowsApi.get,
  createWorkflow: workflowsApi.create,
  updateWorkflow: workflowsApi.update,
  deleteWorkflow: workflowsApi.delete,
  updateWorkflowSteps: workflowsApi.updateSteps,

  listRuns: runsApi.listForProject,
  getRun: runsApi.get,
};
