import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./page";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({
  api: {
    listProjects: jest.fn(),
    listWorkflows: jest.fn(),
    deploy: jest.fn(),
    createProject: jest.fn(),
  },
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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

describe("Dashboard", () => {
  beforeEach(() => {
    (api.listProjects as jest.Mock).mockReset();
    (api.listWorkflows as jest.Mock).mockResolvedValue([]);
  });

  it("shows the empty state when there are no projects", async () => {
    (api.listProjects as jest.Mock).mockResolvedValue([]);
    render(<Dashboard />);
    expect(
      await screen.findByText("No projects yet. Create one to get started."),
    ).toBeInTheDocument();
  });

  it("renders a project card for each project", async () => {
    (api.listProjects as jest.Mock).mockResolvedValue([project]);
    render(<Dashboard />);
    expect(await screen.findByText("My App")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    (api.listProjects as jest.Mock).mockRejectedValue(new Error("down"));
    render(<Dashboard />);
    expect(await screen.findByText("down")).toBeInTheDocument();
  });

  it("opens the New Project modal and refreshes on creation", async () => {
    (api.listProjects as jest.Mock).mockResolvedValue([]);
    render(<Dashboard />);
    await screen.findByText("No projects yet. Create one to get started.");

    await userEvent.click(screen.getByText("New Project"));
    expect(screen.getByText("New Project", { selector: "h2" })).toBeInTheDocument();

    await userEvent.click(screen.getByText("Cancel"));
    await waitFor(() =>
      expect(
        screen.queryByText("New Project", { selector: "h2" }),
      ).not.toBeInTheDocument(),
    );
  });

  it("closes the modal and refreshes projects after creating one", async () => {
    (api.listProjects as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([project]);
    (api.listWorkflows as jest.Mock).mockResolvedValue([
      { id: 1, name: "React", description: "", is_template: true },
    ]);
    (api.createProject as jest.Mock).mockResolvedValue(project);
    render(<Dashboard />);
    await screen.findByText("No projects yet. Create one to get started.");

    await userEvent.click(screen.getByText("New Project"));
    await screen.findByText("React");
    await userEvent.type(screen.getByLabelText(/^Name$/), "My App");
    await userEvent.type(screen.getByLabelText(/Slug/), "my-app");
    await userEvent.click(screen.getByText("Create"));

    await waitFor(() =>
      expect(
        screen.queryByText("New Project", { selector: "h2" }),
      ).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(api.listProjects).toHaveBeenCalledTimes(2));
  });
});
