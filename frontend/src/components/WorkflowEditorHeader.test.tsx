import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkflowEditorHeader from "./WorkflowEditorHeader";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("WorkflowEditorHeader", () => {
  it("renders the current name and description", () => {
    renderWithProviders(
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
    renderWithProviders(
      <WorkflowEditorHeader
        name=""
        onNameChange={onNameChange}
        description=""
        onDescriptionChange={jest.fn()}
        onAddStep={jest.fn()}
      />,
    );
    await userEvent.type(screen.getByTestId("workflow-name-input"), "x");
    expect(onNameChange).toHaveBeenCalled();
  });

  it("calls onDescriptionChange when the description changes", async () => {
    const onDescriptionChange = jest.fn();
    renderWithProviders(
      <WorkflowEditorHeader
        name=""
        onNameChange={jest.fn()}
        description=""
        onDescriptionChange={onDescriptionChange}
        onAddStep={jest.fn()}
      />,
    );
    await userEvent.type(
      screen.getByTestId("workflow-description-input"),
      "x",
    );
    expect(onDescriptionChange).toHaveBeenCalled();
  });

  it("renders the Steps heading and an Add Step button", () => {
    renderWithProviders(
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
