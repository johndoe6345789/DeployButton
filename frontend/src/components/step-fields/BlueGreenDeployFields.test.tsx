import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import BlueGreenDeployFields from "./BlueGreenDeployFields";

describe("BlueGreenDeployFields", () => {
  it("renders the cwd and health timeout values", () => {
    renderWithProviders(
      <BlueGreenDeployFields
        config={{ cwd: "/srv/repos/deploybutton", healthTimeoutSeconds: 60 }}
        onChange={jest.fn()}
      />,
    );
    expect(
      screen.getByDisplayValue("/srv/repos/deploybutton"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("60")).toBeInTheDocument();
  });

  it("calls onChange with the updated cwd", async () => {
    const onChange = jest.fn();
    renderWithProviders(
      <BlueGreenDeployFields config={{}} onChange={onChange} />,
    );
    await userEvent.type(screen.getByRole("textbox"), "x");
    expect(onChange).toHaveBeenCalledWith({ cwd: "x" });
  });

  it("calls onChange with a numeric health timeout", async () => {
    const onChange = jest.fn();
    renderWithProviders(
      <BlueGreenDeployFields
        config={{ healthTimeoutSeconds: 0 }}
        onChange={onChange}
      />,
    );
    await userEvent.clear(screen.getByRole("spinbutton"));
    await userEvent.type(screen.getByRole("spinbutton"), "9");
    expect(onChange).toHaveBeenLastCalledWith({ healthTimeoutSeconds: 9 });
  });
});
