import { request } from "./http";
import { runsApi } from "./runs";

jest.mock("./http", () => ({ request: jest.fn() }));
const mockedRequest = request as jest.Mock;

describe("runsApi", () => {
  beforeEach(() => mockedRequest.mockReset());

  it("listForProject calls GET /api/projects/:id/runs", async () => {
    mockedRequest.mockResolvedValue([]);
    await runsApi.listForProject(8);
    expect(mockedRequest).toHaveBeenCalledWith("/api/projects/8/runs");
  });

  it("get calls GET /api/runs/:id", async () => {
    mockedRequest.mockResolvedValue({});
    await runsApi.get(11);
    expect(mockedRequest).toHaveBeenCalledWith("/api/runs/11");
  });
});
