import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GitPullFields from "./GitPullFields";

describe("GitPullFields", () => {
  it("renders the cwd value", () => {
    render(<GitPullFields config={{ cwd: "/srv/app" }} onChange={jest.fn()} />);
    expect(screen.getByDisplayValue("/srv/app")).toBeInTheDocument();
  });

  it("calls onChange with the updated cwd", async () => {
    const onChange = jest.fn();
    render(<GitPullFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(onChange).toHaveBeenCalledWith({ cwd: "x" });
  });
});
