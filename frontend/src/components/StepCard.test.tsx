import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSortable } from "@dnd-kit/sortable";
import StepCard from "./StepCard";
import type { EditableStep } from "@/types";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("@dnd-kit/sortable", () => ({
  ...jest.requireActual("@dnd-kit/sortable"),
  useSortable: jest.fn(),
}));

const step: EditableStep = {
  key: "1",
  name: "Pull code",
  type: "git_pull",
  config: { cwd: "/srv/app" },
};

function mockSortable(isDragging: boolean) {
  (useSortable as jest.Mock).mockReturnValue({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: undefined,
    isDragging,
  });
}

describe("StepCard", () => {
  beforeEach(() => mockSortable(false));

  it("renders collapsed by default without the config form", () => {
    renderWithProviders(
      <StepCard step={step} onChange={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.queryByDisplayValue("/srv/app")).not.toBeInTheDocument();
  });

  it("expands to show the config form when Configure is clicked", async () => {
    renderWithProviders(
      <StepCard step={step} onChange={jest.fn()} onRemove={jest.fn()} />,
    );
    await userEvent.click(screen.getByTestId("step-toggle-configure"));
    expect(screen.getByDisplayValue("/srv/app")).toBeInTheDocument();
  });

  it("propagates name changes via onChange", async () => {
    const onChange = jest.fn();
    renderWithProviders(
      <StepCard step={step} onChange={onChange} onRemove={jest.fn()} />,
    );
    await userEvent.type(screen.getByTestId("step-name-input"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("propagates config changes via onChange when expanded", async () => {
    const onChange = jest.fn();
    renderWithProviders(
      <StepCard step={step} onChange={onChange} onRemove={jest.fn()} />,
    );
    await userEvent.click(screen.getByTestId("step-toggle-configure"));
    await userEvent.type(screen.getByDisplayValue("/srv/app"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onRemove when Remove is clicked", async () => {
    const onRemove = jest.fn();
    renderWithProviders(
      <StepCard step={step} onChange={jest.fn()} onRemove={onRemove} />,
    );
    await userEvent.click(screen.getByTestId("step-remove"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("fades out while being dragged", () => {
    mockSortable(true);
    const { container } = renderWithProviders(
      <StepCard step={step} onChange={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(container.firstChild).toHaveStyle({ opacity: "0.5" });
  });

  it("falls back to the raw type when it has no known label", () => {
    const unknownStep = {
      ...step,
      type: "custom_type",
    } as unknown as EditableStep;
    renderWithProviders(
      <StepCard step={unknownStep} onChange={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.getByText("custom_type")).toBeInTheDocument();
  });
});
