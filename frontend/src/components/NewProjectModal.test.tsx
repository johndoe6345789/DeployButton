import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProjectModal from "./NewProjectModal";
import { api } from "@/api/client";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@/api/client", () => ({
  api: { listWorkflows: jest.fn(), createProject: jest.fn() },
}));

describe("NewProjectModal", () => {
  beforeEach(() => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([
      { id: 1, name: "React", description: "", is_template: true },
      { id: 2, name: "Node", description: "", is_template: true },
    ]);
    (api.createProject as jest.Mock).mockReset();
  });

  it("loads workflows into the select", async () => {
    renderWithProviders(
      <NewProjectModal onClose={jest.fn()} onCreated={jest.fn()} />,
    );
    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node")).toBeInTheDocument();
  });

  it("exposes a data-testid on the form", async () => {
    renderWithProviders(
      <NewProjectModal onClose={jest.fn()} onCreated={jest.fn()} />,
    );
    expect(await screen.findByTestId("new-project-form")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = jest.fn();
    renderWithProviders(
      <NewProjectModal onClose={onClose} onCreated={jest.fn()} />,
    );
    await screen.findByText("React");
    await userEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("submits the form and calls onCreated", async () => {
    const created = { id: 5, name: "New App" };
    (api.createProject as jest.Mock).mockResolvedValue(created);
    const onCreated = jest.fn();

    renderWithProviders(
      <NewProjectModal onClose={jest.fn()} onCreated={onCreated} />,
    );
    await screen.findByText("React");

    await userEvent.type(screen.getByLabelText(/^Name$/), "New App");
    await userEvent.type(screen.getByLabelText(/Slug/), "new-app");
    await userEvent.type(
      screen.getByLabelText(/Repo URL/),
      "github.com/x/new-app",
    );
    await userEvent.selectOptions(screen.getByLabelText(/Workflow/), "2");
    await userEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(created));
    expect(api.createProject).toHaveBeenCalledWith({
      name: "New App",
      slug: "new-app",
      repo_url: "github.com/x/new-app",
      workflow_id: 2,
    });
  });

  it("shows an error message when creation fails", async () => {
    (api.createProject as jest.Mock).mockRejectedValue(new Error("nope"));
    renderWithProviders(
      <NewProjectModal onClose={jest.fn()} onCreated={jest.fn()} />,
    );
    await screen.findByText("React");

    await userEvent.type(screen.getByLabelText(/^Name$/), "X");
    await userEvent.type(screen.getByLabelText(/Slug/), "x");
    await userEvent.click(screen.getByText("Create"));

    expect(await screen.findByTestId("new-project-error")).toHaveTextContent(
      "nope",
    );
  });

  it("shows a load error if listWorkflows fails", async () => {
    (api.listWorkflows as jest.Mock).mockRejectedValue(new Error("down"));
    renderWithProviders(
      <NewProjectModal onClose={jest.fn()} onCreated={jest.fn()} />,
    );
    expect(await screen.findByText("down")).toBeInTheDocument();
  });
});
