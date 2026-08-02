import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowListItem from "./WorkflowListItem";
import type { Workflow } from "@/types";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 1,
    name: "React App",
    description: "does react things",
    is_template: false,
    ...overrides,
  };
}

describe("WorkflowListItem", () => {
  it("renders the name and links to the editor", () => {
    renderWithProviders(
      <WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText("React App").closest("a")).toHaveAttribute(
      "href",
      "/workflows/1",
    );
  });

  it("exposes a data-testid on the item", () => {
    renderWithProviders(
      <WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />,
    );
    expect(screen.getByTestId("workflow-list-item")).toBeInTheDocument();
  });

  it("shows the description when present", () => {
    renderWithProviders(
      <WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText("does react things")).toBeInTheDocument();
  });

  it("shows a Template badge for template workflows", () => {
    renderWithProviders(
      <WorkflowListItem
        workflow={makeWorkflow({ is_template: true })}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Template")).toBeInTheDocument();
  });

  it("does not show a Template badge for non-templates", () => {
    renderWithProviders(
      <WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />,
    );
    expect(screen.queryByText("Template")).not.toBeInTheDocument();
  });

  it("calls onDelete when Delete is clicked", async () => {
    const onDelete = jest.fn();
    renderWithProviders(
      <WorkflowListItem workflow={makeWorkflow()} onDelete={onDelete} />,
    );
    await userEvent.click(screen.getByTestId("delete-workflow-button"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
