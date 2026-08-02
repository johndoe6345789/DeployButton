import { api } from "./client";
import { projectsApi } from "./projects";
import { runsApi } from "./runs";
import { workflowsApi } from "./workflows";

jest.mock("./projects", () => ({
  projectsApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deploy: jest.fn(),
  },
}));
jest.mock("./workflows", () => ({
  workflowsApi: {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    updateSteps: jest.fn(),
  },
}));
jest.mock("./runs", () => ({
  runsApi: { listForProject: jest.fn(), get: jest.fn() },
}));

describe("api facade", () => {
  it("wires every method to its domain module", () => {
    expect(api.listProjects).toBe(projectsApi.list);
    expect(api.getProject).toBe(projectsApi.get);
    expect(api.createProject).toBe(projectsApi.create);
    expect(api.updateProject).toBe(projectsApi.update);
    expect(api.deleteProject).toBe(projectsApi.delete);
    expect(api.deploy).toBe(projectsApi.deploy);

    expect(api.listWorkflows).toBe(workflowsApi.list);
    expect(api.getWorkflow).toBe(workflowsApi.get);
    expect(api.createWorkflow).toBe(workflowsApi.create);
    expect(api.updateWorkflow).toBe(workflowsApi.update);
    expect(api.deleteWorkflow).toBe(workflowsApi.delete);
    expect(api.updateWorkflowSteps).toBe(workflowsApi.updateSteps);

    expect(api.listRuns).toBe(runsApi.listForProject);
    expect(api.getRun).toBe(runsApi.get);
  });
});
