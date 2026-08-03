import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalFooter } from "./ModalFooter";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("ModalFooter", () => {
  it("calls onCancel when Cancel is clicked", async () => {
    const onCancel = jest.fn();
    renderWithProviders(
      <ModalFooter onCancel={onCancel} submitting={false} />,
    );
    await userEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows default submit label when not submitting", () => {
    renderWithProviders(
      <ModalFooter onCancel={jest.fn()} submitting={false} />,
    );
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("shows submitting label and disables the button while submitting", () => {
    renderWithProviders(<ModalFooter onCancel={jest.fn()} submitting={true} />);
    expect(screen.getByText("Creating...")).toBeInTheDocument();
    expect(screen.getByText("Creating...")).toBeDisabled();
  });

  it("supports custom submit/submitting labels", () => {
    renderWithProviders(
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
