import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowsListHeader from "./WorkflowsListHeader";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("WorkflowsListHeader", () => {
  it("renders the title and back link", () => {
    renderWithProviders(<WorkflowsListHeader onCreate={jest.fn()} />);
    expect(screen.getByText("Workflows")).toBeInTheDocument();
    expect(screen.getByText(/Back to dashboard/).closest("a")).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("calls onCreate when New Workflow is clicked", async () => {
    const onCreate = jest.fn();
    renderWithProviders(<WorkflowsListHeader onCreate={onCreate} />);
    await userEvent.click(screen.getByTestId("new-workflow-button"));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });
});
