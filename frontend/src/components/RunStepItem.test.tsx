import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import RunStepItem from "./RunStepItem";
import type { StepRun } from "@/types";

function makeStep(overrides: Partial<StepRun> = {}): StepRun {
  return {
    id: 1,
    position: 0,
    name: "Pull latest code",
    type: "git_pull",
    status: "success",
    output: "",
    exit_code: 0,
    started_at: "2026-01-01 00:00:00",
    finished_at: "2026-01-01 00:00:01",
    ...overrides,
  };
}

describe("RunStepItem", () => {
  it("renders the step name and status", () => {
    renderWithProviders(<RunStepItem step={makeStep()} />);
    expect(screen.getByText("Pull latest code")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders output when present", () => {
    renderWithProviders(
      <RunStepItem step={makeStep({ output: "hello world\n" })} />,
    );
    expect(screen.getByText(/hello world/)).toBeInTheDocument();
  });

  it("renders no <pre> block when output is empty", () => {
    renderWithProviders(<RunStepItem step={makeStep({ output: "" })} />);
    expect(document.querySelector("pre")).not.toBeInTheDocument();
  });
});
