import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import RunStepItem from "./RunStepItem";
import type { StepRun } from "@/types";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({
  api: { getStepOutput: jest.fn() },
}));

function makeStep(overrides: Partial<StepRun> = {}): StepRun {
  return {
    id: 1,
    position: 0,
    name: "Pull latest code",
    type: "git_pull",
    status: "success",
    output_length: 0,
    exit_code: 0,
    started_at: "2026-01-01 00:00:00",
    finished_at: "2026-01-01 00:00:01",
    ...overrides,
  };
}

describe("RunStepItem", () => {
  beforeEach(() => (api.getStepOutput as jest.Mock).mockReset());

  it("renders the step name and status", () => {
    renderWithProviders(<RunStepItem step={makeStep()} />);
    expect(screen.getByText("Pull latest code")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders output when present", async () => {
    (api.getStepOutput as jest.Mock).mockResolvedValue({
      text: "hello world\n",
      start_offset: 0,
      end_offset: 12,
      total_length: 12,
    });
    renderWithProviders(
      <RunStepItem step={makeStep({ output_length: 12 })} />,
    );
    expect(await screen.findByText(/hello world/)).toBeInTheDocument();
  });

  it("renders no <pre> block when output is empty", () => {
    renderWithProviders(<RunStepItem step={makeStep({ output_length: 0 })} />);
    expect(document.querySelector("pre")).not.toBeInTheDocument();
    expect(api.getStepOutput).not.toHaveBeenCalled();
  });
});
