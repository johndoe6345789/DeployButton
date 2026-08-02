import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveBar from "./SaveBar";

describe("SaveBar", () => {
  it("shows Save when not saving and calls onSave when clicked", async () => {
    const onSave = jest.fn();
    render(
      <SaveBar
        saving={false}
        saved={false}
        error={null}
        onSave={onSave}
        onDone={jest.fn()}
      />,
    );
    await userEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("shows Saving... and disables the button while saving", () => {
    render(
      <SaveBar
        saving={true}
        saved={false}
        error={null}
        onSave={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByText("Saving...")).toBeDisabled();
  });

  it("shows a saved confirmation", () => {
    render(
      <SaveBar
        saving={false}
        saved={true}
        error={null}
        onSave={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByText("Saved.")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(
      <SaveBar
        saving={false}
        saved={false}
        error="Failed to save"
        onSave={jest.fn()}
        onDone={jest.fn()}
      />,
    );
    expect(screen.getByText("Failed to save")).toBeInTheDocument();
  });

  it("calls onDone when Done is clicked", async () => {
    const onDone = jest.fn();
    render(
      <SaveBar
        saving={false}
        saved={false}
        error={null}
        onSave={jest.fn()}
        onDone={onDone}
      />,
    );
    await userEvent.click(screen.getByText("Done"));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
