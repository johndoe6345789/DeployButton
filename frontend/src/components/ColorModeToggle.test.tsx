import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ColorModeToggle from "./ColorModeToggle";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("ColorModeToggle", () => {
  it("shows a button to switch to dark mode when in light mode", async () => {
    renderWithProviders(<ColorModeToggle />);
    expect(
      await screen.findByLabelText("Switch to dark mode"),
    ).toBeInTheDocument();
  });

  it("switches to light mode label after being clicked", async () => {
    renderWithProviders(<ColorModeToggle />);
    const button = await screen.findByTestId("color-mode-toggle");
    await userEvent.click(button);
    expect(
      await screen.findByLabelText("Switch to light mode"),
    ).toBeInTheDocument();
  });
});
