import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShellFields from "./ShellFields";

describe("ShellFields", () => {
  it("renders cwd and command values", () => {
    render(
      <ShellFields
        config={{ cwd: "/srv/app", command: "echo hi" }}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByDisplayValue("/srv/app")).toBeInTheDocument();
    expect(screen.getByDisplayValue("echo hi")).toBeInTheDocument();
  });

  it("calls onChange with the updated command", async () => {
    const onChange = jest.fn();
    render(<ShellFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText("echo hello"), "x");
    expect(onChange).toHaveBeenCalledWith({ command: "x" });
  });

  it("calls onChange with the updated working directory", async () => {
    const onChange = jest.fn();
    render(<ShellFields config={{}} onChange={onChange} />);
    await userEvent.type(
      screen.getByPlaceholderText("/srv/repos/my-app"),
      "x",
    );
    expect(onChange).toHaveBeenCalledWith({ cwd: "x" });
  });
});
