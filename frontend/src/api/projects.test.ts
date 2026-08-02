import { request } from "./http";
import { projectsApi } from "./projects";

jest.mock("./http", () => ({ request: jest.fn() }));
const mockedRequest = request as jest.Mock;

describe("projectsApi", () => {
  beforeEach(() => mockedRequest.mockReset());

  it("list calls GET /api/projects", async () => {
    mockedRequest.mockResolvedValue([]);
    await projectsApi.list();
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects");
  });

  it("get calls GET /api/projects/:id", async () => {
    mockedRequest.mockResolvedValue({});
    await projectsApi.get(5);
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects/5");
  });

  it("create POSTs the project payload", async () => {
    mockedRequest.mockResolvedValue({});
    const data = {
      name: "App",
      slug: "app",
      repo_url: "",
      workflow_id: 1,
    };
    await projectsApi.create(data);
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  });

  it("update PUTs to the project id", async () => {
    mockedRequest.mockResolvedValue({});
    const data = { name: "A", slug: "a", repo_url: "", workflow_id: 1 };
    await projectsApi.update(9, data);
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects/9", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });

  it("delete DELETEs the project id", async () => {
    mockedRequest.mockResolvedValue(undefined);
    await projectsApi.delete(3);
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects/3", {
      method: "DELETE",
    });
  });

  it("deploy POSTs to the deploy endpoint", async () => {
    mockedRequest.mockResolvedValue({ runId: 42 });
    const result = await projectsApi.deploy(3);
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects/3/deploy", {
      method: "POST",
    });
    expect(result).toEqual({ runId: 42 });
  });
});
