import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import WorkflowEditor from "./page";
import { api } from "@/api/client";

const pushMock = jest.fn();
jest.mock("@/api/client", () => ({
  api: {
    getWorkflow: jest.fn(),
    updateWorkflow: jest.fn(),
    updateWorkflowSteps: jest.fn(),
  },
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useParams: () => ({ id: "1" }),
}));

function makeWorkflow() {
  return {
    id: 1,
    name: "My Workflow",
    description: "desc",
    is_template: false,
    steps: [{ id: 5, position: 0, name: "Step 1", type: "shell", config: {} }],
  };
}

describe("WorkflowEditor page", () => {
  beforeEach(() => {
    pushMock.mockReset();
    (api.getWorkflow as jest.Mock).mockReset();
    (api.updateWorkflow as jest.Mock).mockReset();
    (api.updateWorkflowSteps as jest.Mock).mockReset();
  });

  it("shows a loading state, then the loaded workflow", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    renderWithProviders(<WorkflowEditor />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("My Workflow")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Step 1")).toBeInTheDocument();
  });

  it("saves and shows a confirmation", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    (api.updateWorkflow as jest.Mock).mockResolvedValue({});
    (api.updateWorkflowSteps as jest.Mock).mockResolvedValue({});
    renderWithProviders(<WorkflowEditor />);
    await screen.findByDisplayValue("My Workflow");

    await userEvent.click(screen.getByText("Save"));
    expect(await screen.findByText("Saved.")).toBeInTheDocument();
  });

  it("removes a step from the list", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    renderWithProviders(<WorkflowEditor />);
    await screen.findByDisplayValue("Step 1");

    await userEvent.click(screen.getByText("Remove"));
    await waitFor(() =>
      expect(screen.queryByDisplayValue("Step 1")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("No steps yet. Add one above.")).toBeInTheDocument();
  });

  it("navigates back to the workflow list when Done is clicked", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    renderWithProviders(<WorkflowEditor />);
    await screen.findByDisplayValue("My Workflow");

    await userEvent.click(screen.getByText("Done"));
    expect(pushMock).toHaveBeenCalledWith("/workflows");
  });

  it("edits a step's name in place", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    renderWithProviders(<WorkflowEditor />);
    const stepName = await screen.findByDisplayValue("Step 1");

    await userEvent.type(stepName, "!");
    expect(await screen.findByDisplayValue("Step 1!")).toBeInTheDocument();
  });

  it("adds a new step via the Add Step menu", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    renderWithProviders(<WorkflowEditor />);
    await screen.findByDisplayValue("Step 1");

    await userEvent.click(screen.getByText("Add Step"));
    expect(await screen.findAllByText("Configure")).toHaveLength(2);
  });
});
