import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import RunDetailPage from "./page";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({
  api: { getRun: jest.fn(), getStepOutput: jest.fn() },
}));
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
      output_length: 5,
      exit_code: 0,
      started_at: "2026-01-01 00:00:00",
      finished_at: "2026-01-01 00:00:01",
    },
  ],
};

describe("RunDetailPage", () => {
  beforeEach(() => {
    (api.getRun as jest.Mock).mockReset();
    (api.getStepOutput as jest.Mock).mockReset().mockResolvedValue({
      text: "done\n",
      start_offset: 0,
      end_offset: 5,
      total_length: 5,
    });
  });

  it("shows Loading before the run has resolved", () => {
    (api.getRun as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<RunDetailPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the run status and step output", async () => {
    (api.getRun as jest.Mock).mockResolvedValue(runDetail);
    renderWithProviders(<RunDetailPage />);

    expect(screen.getByText("Run #7")).toBeInTheDocument();
    expect(await screen.findByText("Pull")).toBeInTheDocument();
    expect(await screen.findByText(/done/)).toBeInTheDocument();
  });

  it("links back to the project's run history once loaded", async () => {
    (api.getRun as jest.Mock).mockResolvedValue(runDetail);
    renderWithProviders(<RunDetailPage />);
    const link = await screen.findByText("← Back to run history");
    expect(link).toHaveAttribute("href", "/projects/3/runs");
  });

  it("shows an error message when loading fails", async () => {
    (api.getRun as jest.Mock).mockRejectedValue(new Error("down"));
    renderWithProviders(<RunDetailPage />);
    expect(await screen.findByText("down")).toBeInTheDocument();
  });

  it("follows the bottom of the page while the run is still going", async () => {
    const scrollTo = jest.fn();
    window.scrollTo = scrollTo;
    (api.getRun as jest.Mock).mockResolvedValue({
      ...runDetail,
      status: "running",
    });
    renderWithProviders(<RunDetailPage />);
    await screen.findByText("Pull");
    expect(scrollTo).toHaveBeenCalled();
  });

  it("does not auto-scroll once the run has already finished", async () => {
    const scrollTo = jest.fn();
    window.scrollTo = scrollTo;
    (api.getRun as jest.Mock).mockResolvedValue(runDetail);
    renderWithProviders(<RunDetailPage />);
    await screen.findByText("Pull");
    expect(scrollTo).not.toHaveBeenCalled();
  });
});
