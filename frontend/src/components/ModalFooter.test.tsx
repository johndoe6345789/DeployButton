import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalFooter } from "./ModalFooter";

describe("ModalFooter", () => {
  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = jest.fn();
    render(<ModalFooter onCancel={onCancel} submitting={false} />);
    await userEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows default submit label when not submitting", () => {
    render(<ModalFooter onCancel={jest.fn()} submitting={false} />);
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("shows submitting label and disables the button while submitting", () => {
    render(<ModalFooter onCancel={jest.fn()} submitting={true} />);
    expect(screen.getByText("Creating...")).toBeInTheDocument();
    expect(screen.getByText("Creating...")).toBeDisabled();
  });

  it("supports custom submit/submitting labels", () => {
    render(
      <ModalFooter
        onCancel={jest.fn()}
        submitting={false}
        submitLabel="Save"
        submittingLabel="Saving..."
      />,
    );
    expect(screen.getByText("Save")).toBeInTheDocument();
  });
});
