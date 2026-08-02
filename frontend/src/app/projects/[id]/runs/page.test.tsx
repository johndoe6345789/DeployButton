import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import RunHistory from "./page";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({
  api: { getProject: jest.fn(), listRuns: jest.fn() },
}));
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

const project = {
  id: 1,
  name: "My App",
  slug: "my-app",
  repo_url: null,
  workflow_id: 1,
  workflow_name: "React",
  last_run_status: null,
  last_run_started_at: null,
  last_run_finished_at: null,
};

const run = {
  id: 7,
  project_id: 1,
  workflow_id: 1,
  trigger_type: "manual" as const,
  status: "success" as const,
  started_at: "2026-01-01 00:00:00",
  finished_at: "2026-01-01 00:00:05",
};

describe("RunHistory page", () => {
  beforeEach(() => {
    (api.getProject as jest.Mock).mockReset();
    (api.listRuns as jest.Mock).mockReset();
  });

  it("shows the project name and an empty state when there are no runs", async () => {
    (api.getProject as jest.Mock).mockResolvedValue(project);
    (api.listRuns as jest.Mock).mockResolvedValue([]);
    renderWithProviders(<RunHistory />);

    expect(
      await screen.findByText("My App — Run History"),
    ).toBeInTheDocument();
    expect(screen.getByText("No runs yet.")).toBeInTheDocument();
  });

  it("renders a run row linking to the run detail page", async () => {
    (api.getProject as jest.Mock).mockResolvedValue(project);
    (api.listRuns as jest.Mock).mockResolvedValue([run]);
    renderWithProviders(<RunHistory />);

    const link = await screen.findByText("Manual");
    expect(link.closest("a")).toHaveAttribute("href", "/runs/7");
  });

  it("shows an error message when loading fails", async () => {
    (api.getProject as jest.Mock).mockRejectedValue(new Error("down"));
    (api.listRuns as jest.Mock).mockResolvedValue([]);
    renderWithProviders(<RunHistory />);
    expect(await screen.findByText("down")).toBeInTheDocument();
  });

  it("shows a fallback error message for a non-Error rejection", async () => {
    (api.getProject as jest.Mock).mockRejectedValue("boom");
    (api.listRuns as jest.Mock).mockResolvedValue([]);
    renderWithProviders(<RunHistory />);
    expect(await screen.findByText("Failed to load")).toBeInTheDocument();
  });

  it("labels a webhook-triggered run", async () => {
    (api.getProject as jest.Mock).mockResolvedValue(project);
    (api.listRuns as jest.Mock).mockResolvedValue([
      { ...run, trigger_type: "github_webhook" },
    ]);
    renderWithProviders(<RunHistory />);
    expect(await screen.findByText("GitHub webhook")).toBeInTheDocument();
  });
});
