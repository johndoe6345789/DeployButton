import { render, screen } from "@testing-library/react";
import StepConfigForm from "./StepConfigForm";
import type { StepType } from "@/types";
import { STEP_TYPES } from "@/types";

describe("StepConfigForm", () => {
  it.each(STEP_TYPES.map((t) => t.value))(
    "renders fields for step type %s without crashing",
    (type: StepType) => {
      const { container } = render(
        <StepConfigForm type={type} config={{}} onChange={jest.fn()} />,
      );
      expect(container.firstChild).not.toBeNull();
    },
  );

  it("passes config and onChange through to the git_pull fields", () => {
    render(
      <StepConfigForm
        type="git_pull"
        config={{ cwd: "/srv/app" }}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByDisplayValue("/srv/app")).toBeInTheDocument();
  });

  it("renders nothing for an unknown step type", () => {
    const { container } = render(
      <StepConfigForm
        type={"unknown_type" as StepType}
        config={{}}
        onChange={jest.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
