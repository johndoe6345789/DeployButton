import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowEditorHeader from "./WorkflowEditorHeader";

describe("WorkflowEditorHeader", () => {
  it("renders the current name and description", () => {
    render(
      <WorkflowEditorHeader
        name="My Workflow"
        onNameChange={jest.fn()}
        description="does things"
        onDescriptionChange={jest.fn()}
        onAddStep={jest.fn()}
      />,
    );
    expect(screen.getByDisplayValue("My Workflow")).toBeInTheDocument();
    expect(screen.getByDisplayValue("does things")).toBeInTheDocument();
  });

  it("calls onNameChange when the name input changes", async () => {
    const onNameChange = jest.fn();
    const { container } = render(
      <WorkflowEditorHeader
        name=""
        onNameChange={onNameChange}
        description=""
        onDescriptionChange={jest.fn()}
        onAddStep={jest.fn()}
      />,
    );
    const nameInput = container.querySelector("input") as HTMLInputElement;
    await userEvent.type(nameInput, "x");
    expect(onNameChange).toHaveBeenCalled();
  });

  it("calls onDescriptionChange when the description changes", async () => {
    const onDescriptionChange = jest.fn();
    const { container } = render(
      <WorkflowEditorHeader
        name=""
        onNameChange={jest.fn()}
        description=""
        onDescriptionChange={onDescriptionChange}
        onAddStep={jest.fn()}
      />,
    );
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    await userEvent.type(textarea, "x");
    expect(onDescriptionChange).toHaveBeenCalled();
  });

  it("renders the Steps heading and an Add Step button", () => {
    render(
      <WorkflowEditorHeader
        name=""
        onNameChange={jest.fn()}
        description=""
        onDescriptionChange={jest.fn()}
        onAddStep={jest.fn()}
      />,
    );
    expect(screen.getByText("Steps")).toBeInTheDocument();
    expect(screen.getByText("Add Step")).toBeInTheDocument();
  });
});
