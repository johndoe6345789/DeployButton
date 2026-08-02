import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowListItem from "./WorkflowListItem";
import type { Workflow } from "@/types";

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
    render(<WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />);
    expect(screen.getByText("React App").closest("a")).toHaveAttribute(
      "href",
      "/workflows/1",
    );
  });

  it("shows the description when present", () => {
    render(<WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />);
    expect(screen.getByText("does react things")).toBeInTheDocument();
  });

  it("shows a Template badge for template workflows", () => {
    render(
      <WorkflowListItem
        workflow={makeWorkflow({ is_template: true })}
        onDelete={jest.fn()}
      />,
    );
    expect(screen.getByText("Template")).toBeInTheDocument();
  });

  it("does not show a Template badge for non-templates", () => {
    render(<WorkflowListItem workflow={makeWorkflow()} onDelete={jest.fn()} />);
    expect(screen.queryByText("Template")).not.toBeInTheDocument();
  });

  it("calls onDelete when Delete is clicked", async () => {
    const onDelete = jest.fn();
    render(<WorkflowListItem workflow={makeWorkflow()} onDelete={onDelete} />);
    await userEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
