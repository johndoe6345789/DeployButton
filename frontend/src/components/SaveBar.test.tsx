import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveBar from "./SaveBar";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("SaveBar", () => {
  it("shows Save when not saving and calls onSave when clicked", async () => {
    const onSave = jest.fn();
    renderWithProviders(
      <SaveBar
        saving={false}
        saved={false}
        error={null}
        onSave={onSave}
        onDone={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByTestId("save-workflow-button"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("shows Saving... and disables the button while saving", () => {
    renderWithProviders(
      <SaveBar
        saving={true}
        saved={false}
        error={null}
        onSave={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByTestId("save-workflow-button")).toBeDisabled();
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("shows a saved confirmation", () => {
    renderWithProviders(
      <SaveBar
        saving={false}
        saved={true}
        error={null}
        onSave={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByTestId("save-success")).toHaveTextContent("Saved.");
  });

  it("shows an error message", () => {
    renderWithProviders(
      <SaveBar
        saving={false}
        saved={false}
        error="Failed to save"
        onSave={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByTestId("save-error")).toHaveTextContent(
      "Failed to save",
    );
  });

  it("calls onDone when Done is clicked", async () => {
    const onDone = jest.fn();
    renderWithProviders(
      <SaveBar
        saving={false}
        saved={false}
        error={null}
        onSave={jest.fn()}
        onDone={onDone}
      />,
    );
    await userEvent.click(screen.getByTestId("done-button"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
