import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowList from "./page";
import { api } from "@/api/client";

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
    render(<WorkflowList />);
    expect(await screen.findByText("React App")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    (api.listWorkflows as jest.Mock).mockRejectedValue(new Error("down"));
    render(<WorkflowList />);
    expect(await screen.findByText("down")).toBeInTheDocument();
  });

  it("creates a workflow and navigates to its editor", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([]);
    (api.createWorkflow as jest.Mock).mockResolvedValue({ id: 9 });
    render(<WorkflowList />);
    await screen.findByText("New Workflow");

    await userEvent.click(screen.getByText("New Workflow"));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/workflows/9"));
  });

  it("deletes a workflow after confirmation", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([workflow]);
    (api.deleteWorkflow as jest.Mock).mockResolvedValue(undefined);
    window.confirm = jest.fn(() => true);

    render(<WorkflowList />);
    await screen.findByText("React App");
    await userEvent.click(screen.getByText("Delete"));

    await waitFor(() => expect(api.deleteWorkflow).toHaveBeenCalledWith(1));
  });

  it("does not delete when confirmation is declined", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([workflow]);
    window.confirm = jest.fn(() => false);

    render(<WorkflowList />);
    await screen.findByText("React App");
    await userEvent.click(screen.getByText("Delete"));

    expect(api.deleteWorkflow).not.toHaveBeenCalled();
  });
});
