import { screen } from "@testing-library/react";
import GlobalControls from "./GlobalControls";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

describe("GlobalControls", () => {
  it("renders the language switcher and color mode toggle", async () => {
    renderWithProviders(<GlobalControls />);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
    expect(
      await screen.findByTestId("color-mode-toggle"),
    ).toBeInTheDocument();
  });
});
