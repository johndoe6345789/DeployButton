import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StepsList from "./StepsList";
import type { EditableStep } from "@/types";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

const steps: EditableStep[] = [
  { key: "a", name: "Step A", type: "shell", config: {} },
  { key: "b", name: "Step B", type: "delay", config: {} },
];

describe("StepsList", () => {
  it("renders a StepCard for each step", () => {
    renderWithProviders(
      <StepsList
        steps={steps}
        onDragEnd={jest.fn()}
        onChangeStep={jest.fn()}
        onRemoveStep={jest.fn()}
      />,
    );
    expect(screen.getByDisplayValue("Step A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Step B")).toBeInTheDocument();
  });

  it("exposes a data-testid on the list", () => {
    renderWithProviders(
      <StepsList
        steps={steps}
        onDragEnd={jest.fn()}
        onChangeStep={jest.fn()}
        onRemoveStep={jest.fn()}
      />,
    );
    expect(screen.getByTestId("steps-list")).toBeInTheDocument();
  });

  it("shows an empty-state message when there are no steps", () => {
    renderWithProviders(
      <StepsList
        steps={[]}
        onDragEnd={jest.fn()}
        onChangeStep={jest.fn()}
        onRemoveStep={jest.fn()}
      />,
    );
    expect(screen.getByText("No steps yet. Add one above.")).toBeInTheDocument();
  });

  it("calls onRemoveStep with the removed step's key", async () => {
    const onRemoveStep = jest.fn();
    renderWithProviders(
      <StepsList
        steps={steps}
        onDragEnd={jest.fn()}
        onChangeStep={jest.fn()}
        onRemoveStep={onRemoveStep}
      />,
    );
    await userEvent.click(screen.getAllByTestId("step-remove")[0]);
    expect(onRemoveStep).toHaveBeenCalledWith("a");
  });

  it("calls onChangeStep with the changed step's key", async () => {
    const onChangeStep = jest.fn();
    renderWithProviders(
      <StepsList
        steps={steps}
        onDragEnd={jest.fn()}
        onChangeStep={onChangeStep}
        onRemoveStep={jest.fn()}
      />,
    );
    await userEvent.type(screen.getByDisplayValue("Step A"), "x");
    expect(onChangeStep).toHaveBeenCalledWith(
      "a",
      expect.objectContaining({ name: "Step Ax" }),
    );
  });
});
