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

  it("getStepOutput with no params calls GET /api/step-runs/:id/output", async () => {
    mockedRequest.mockResolvedValue({});
    await runsApi.getStepOutput(5);
    expect(mockedRequest).toHaveBeenCalledWith("/api/step-runs/5/output");
  });

  it("getStepOutput builds a query string from the params given", async () => {
    mockedRequest.mockResolvedValue({});
    await runsApi.getStepOutput(5, { before: 100, limit: 4096 });
    expect(mockedRequest).toHaveBeenCalledWith(
      "/api/step-runs/5/output?limit=4096&before=100",
    );
  });

  it("getStepOutput supports after for live-tail polling", async () => {
    mockedRequest.mockResolvedValue({});
    await runsApi.getStepOutput(5, { after: 200 });
    expect(mockedRequest).toHaveBeenCalledWith(
      "/api/step-runs/5/output?after=200",
    );
  });
});
