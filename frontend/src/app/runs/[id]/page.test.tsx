import { render, screen } from "@testing-library/react";
import RunDetailPage from "./page";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({ api: { getRun: jest.fn() } }));
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "7" }),
}));

const runDetail = {
  id: 7,
  project_id: 3,
  workflow_id: 1,
  trigger_type: "manual" as const,
  status: "success" as const,
  started_at: "2026-01-01 00:00:00",
  finished_at: "2026-01-01 00:00:05",
  step_runs: [
    {
      id: 1,
      position: 0,
      name: "Pull",
      type: "git_pull" as const,
      status: "success" as const,
      output: "done\n",
      exit_code: 0,
      started_at: "2026-01-01 00:00:00",
      finished_at: "2026-01-01 00:00:01",
    },
  ],
};

describe("RunDetailPage", () => {
  beforeEach(() => (api.getRun as jest.Mock).mockReset());

  it("shows Loading before the run has resolved", () => {
    (api.getRun as jest.Mock).mockReturnValue(new Promise(() => {}));
    render(<RunDetailPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the run status and step output", async () => {
    (api.getRun as jest.Mock).mockResolvedValue(runDetail);
    render(<RunDetailPage />);

    expect(screen.getByText("Run #7")).toBeInTheDocument();
    expect(await screen.findByText("Pull")).toBeInTheDocument();
    expect(screen.getByText(/done/)).toBeInTheDocument();
  });

  it("links back to the project's run history once loaded", async () => {
    (api.getRun as jest.Mock).mockResolvedValue(runDetail);
    render(<RunDetailPage />);
    const link = await screen.findByText("← Back to run history");
    expect(link).toHaveAttribute("href", "/projects/3/runs");
  });

  it("shows an error message when loading fails", async () => {
    (api.getRun as jest.Mock).mockRejectedValue(new Error("down"));
    render(<RunDetailPage />);
    expect(await screen.findByText("down")).toBeInTheDocument();
  });
});
