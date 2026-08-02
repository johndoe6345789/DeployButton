import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowList from "./page";
import { api } from "@/api/client";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

const pushMock = jest.fn();
jest.mock("@/api/client", () => ({
  api: {
    listWorkflows: jest.fn(),
    createWorkflow: jest.fn(),
    deleteWorkflow: jest.fn(),
  },
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const workflow = {
  id: 1,
  name: "React App",
  description: "",
  is_template: true,
};

describe("WorkflowList", () => {
  beforeEach(() => {
    pushMock.mockReset();
    (api.listWorkflows as jest.Mock).mockReset();
    (api.createWorkflow as jest.Mock).mockReset();
    (api.deleteWorkflow as jest.Mock).mockReset();
  });

  it("renders workflows from the API", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([workflow]);
    renderWithProviders(<WorkflowList />);
    expect(await screen.findByText("React App")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    (api.listWorkflows as jest.Mock).mockRejectedValue(new Error("down"));
    renderWithProviders(<WorkflowList />);
    expect(await screen.findByTestId("workflows-error")).toHaveTextContent(
      "down",
    );
  });

  it("creates a workflow and navigates to its editor", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([]);
    (api.createWorkflow as jest.Mock).mockResolvedValue({ id: 9 });
    renderWithProviders(<WorkflowList />);
    await screen.findByTestId("new-workflow-button");

    await userEvent.click(screen.getByTestId("new-workflow-button"));
    expect(api.createWorkflow).toHaveBeenCalledWith({
      name: "New Workflow",
      description: "",
    });
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/workflows/9"));
  });

  it("deletes a workflow after confirmation", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([workflow]);
    (api.deleteWorkflow as jest.Mock).mockResolvedValue(undefined);
    window.confirm = jest.fn(() => true);

    renderWithProviders(<WorkflowList />);
    await screen.findByText("React App");
    await userEvent.click(screen.getByTestId("delete-workflow-button"));

    await waitFor(() => expect(api.deleteWorkflow).toHaveBeenCalledWith(1));
  });

  it("does not delete when confirmation is declined", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([workflow]);
    window.confirm = jest.fn(() => false);

    renderWithProviders(<WorkflowList />);
    await screen.findByText("React App");
    await userEvent.click(screen.getByTestId("delete-workflow-button"));

    expect(api.deleteWorkflow).not.toHaveBeenCalled();
  });
});
