import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DockerBuildFields from "./DockerBuildFields";

describe("DockerBuildFields", () => {
  it("defaults the dockerfile to Dockerfile", () => {
    render(<DockerBuildFields config={{}} onChange={jest.fn()} />);
    expect(screen.getByDisplayValue("Dockerfile")).toBeInTheDocument();
  });

  it("calls onChange when the tag changes", async () => {
    const onChange = jest.fn();
    render(<DockerBuildFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Image tag"), "x");
    expect(onChange).toHaveBeenCalledWith({ tag: "x" });
  });

  it("calls onChange when the dockerfile changes", async () => {
    const onChange = jest.fn();
    render(<DockerBuildFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Dockerfile"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("calls onChange when cwd changes", async () => {
    const onChange = jest.fn();
    render(<DockerBuildFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Working directory"), "x");
    expect(onChange).toHaveBeenCalledWith({ cwd: "x" });
  });
});
