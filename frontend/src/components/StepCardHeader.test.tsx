import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StepCardHeader from "./StepCardHeader";
import type { EditableStep } from "@/types";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

const step: EditableStep = {
  key: "1",
  name: "Pull code",
  type: "git_pull",
  config: {},
};

describe("StepCardHeader", () => {
  it("renders the step name and type label", () => {
    renderWithProviders(
      <StepCardHeader
        step={step}
        typeLabel="Git pull"
        expanded={false}
        onNameChange={jest.fn()}
        onToggleExpanded={jest.fn()}
        onRemove={jest.fn()}
        dragHandleProps={{}}
      />,
    );
    expect(screen.getByDisplayValue("Pull code")).toBeInTheDocument();
    expect(screen.getByText("Git pull")).toBeInTheDocument();
  });

  it("shows Configure when collapsed and Collapse when expanded", () => {
    const { rerender } = renderWithProviders(
      <StepCardHeader
        step={step}
        typeLabel="Git pull"
        expanded={false}
        onNameChange={jest.fn()}
        onToggleExpanded={jest.fn()}
        onRemove={jest.fn()}
        dragHandleProps={{}}
      />,
    );
    expect(screen.getByText("Configure")).toBeInTheDocument();

    rerender(
      <StepCardHeader
        step={step}
        typeLabel="Git pull"
        expanded={true}
        onNameChange={jest.fn()}
        onToggleExpanded={jest.fn()}
        onRemove={jest.fn()}
        dragHandleProps={{}}
      />,
    );
    expect(screen.getByText("Collapse")).toBeInTheDocument();
  });

  it("calls onNameChange, onToggleExpanded, and onRemove", async () => {
    const onNameChange = jest.fn();
    const onToggleExpanded = jest.fn();
    const onRemove = jest.fn();
    renderWithProviders(
      <StepCardHeader
        step={step}
        typeLabel="Git pull"
        expanded={false}
        onNameChange={onNameChange}
        onToggleExpanded={onToggleExpanded}
        onRemove={onRemove}
        dragHandleProps={{}}
      />,
    );

    await userEvent.type(screen.getByDisplayValue("Pull code"), "x");
    expect(onNameChange).toHaveBeenCalled();

    await userEvent.click(screen.getByTestId("step-toggle-configure"));
    expect(onToggleExpanded).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByTestId("step-remove"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("exposes an aria-label on the drag handle", () => {
    renderWithProviders(
      <StepCardHeader
        step={step}
        typeLabel="Git pull"
        expanded={false}
        onNameChange={jest.fn()}
        onToggleExpanded={jest.fn()}
        onRemove={jest.fn()}
        dragHandleProps={{}}
      />,
    );
    expect(screen.getByTestId("step-drag-handle")).toHaveAttribute(
      "aria-label",
      "Drag to reorder",
    );
  });
});
