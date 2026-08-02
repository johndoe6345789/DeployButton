import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NpmInstallFields from "./NpmInstallFields";

describe("NpmInstallFields", () => {
  it("defaults the manager to npm", () => {
    render(<NpmInstallFields config={{}} onChange={jest.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("npm");
  });

  it("calls onChange when the manager changes", async () => {
    const onChange = jest.fn();
    render(<NpmInstallFields config={{}} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "yarn");
    expect(onChange).toHaveBeenCalledWith({ manager: "yarn" });
  });

  it("calls onChange when cwd changes", async () => {
    const onChange = jest.fn();
    render(<NpmInstallFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(onChange).toHaveBeenCalledWith({ cwd: "x" });
  });
});
