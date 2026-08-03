import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import NpmBuildFields from "./NpmBuildFields";

describe("NpmBuildFields", () => {
  it("defaults the script to build", () => {
    renderWithProviders(<NpmBuildFields config={{}} onChange={jest.fn()} />);
    expect(screen.getByDisplayValue("build")).toBeInTheDocument();
  });

  it("calls onChange when the script changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<NpmBuildFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Script"), "x");
    expect(onChange).toHaveBeenCalledWith({ script: "buildx" });
  });

  it("calls onChange when the manager changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<NpmBuildFields config={{}} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "pnpm");
    expect(onChange).toHaveBeenCalledWith({ manager: "pnpm" });
  });

  it("calls onChange when cwd changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<NpmBuildFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Working directory"), "x");
    expect(onChange).toHaveBeenCalledWith({ cwd: "x" });
  });
});
