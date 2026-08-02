import { request } from "./http";
import { workflowsApi } from "./workflows";

jest.mock("./http", () => ({ request: jest.fn() }));
const mockedRequest = request as jest.Mock;

describe("workflowsApi", () => {
  beforeEach(() => mockedRequest.mockReset());

  it("list calls GET /api/workflows", async () => {
    mockedRequest.mockResolvedValue([]);
    await workflowsApi.list();
    expect(mockedRequest).toHaveBeenCalledWith("/api/workflows");
  });

  it("get calls GET /api/workflows/:id", async () => {
    mockedRequest.mockResolvedValue({});
    await workflowsApi.get(4);
    expect(mockedRequest).toHaveBeenCalledWith("/api/workflows/4");
  });

  it("create POSTs the workflow payload", async () => {
    mockedRequest.mockResolvedValue({});
    const data = { name: "W", description: "d" };
    await workflowsApi.create(data);
    expect(mockedRequest).toHaveBeenCalledWith("/api/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("update PUTs to the workflow id", async () => {
    mockedRequest.mockResolvedValue({});
    const data = { name: "W2", description: "d2" };
    await workflowsApi.update(7, data);
    expect(mockedRequest).toHaveBeenCalledWith("/api/workflows/7", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("delete DELETEs the workflow id", async () => {
    mockedRequest.mockResolvedValue(undefined);
    await workflowsApi.delete(2);
    expect(mockedRequest).toHaveBeenCalledWith("/api/workflows/2", {
      method: "DELETE",
    });
  });

  it("updateSteps PUTs the steps array", async () => {
    mockedRequest.mockResolvedValue({});
    const steps = [{ name: "S", type: "shell", config: {} }];
    await workflowsApi.updateSteps(6, steps);
    expect(mockedRequest).toHaveBeenCalledWith("/api/workflows/6/steps", {
      method: "PUT",
      body: JSON.stringify(steps),
    });
  });
});
