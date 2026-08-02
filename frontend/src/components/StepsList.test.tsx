import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StepsList from "./StepsList";
import type { EditableStep } from "@/types";

const steps: EditableStep[] = [
  { key: "a", name: "Step A", type: "shell", config: {} },
  { key: "b", name: "Step B", type: "delay", config: {} },
];

describe("StepsList", () => {
  it("renders a StepCard for each step", () => {
    render(
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

  it("shows an empty-state message when there are no steps", () => {
    render(
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
    render(
      <StepsList
        steps={steps}
        onDragEnd={jest.fn()}
        onChangeStep={jest.fn()}
        onRemoveStep={onRemoveStep}
      />,
    );
    await userEvent.click(screen.getAllByText("Remove")[0]);
    expect(onRemoveStep).toHaveBeenCalledWith("a");
  });

  it("calls onChangeStep with the changed step's key", async () => {
    const onChangeStep = jest.fn();
    render(
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
