import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import AnsiOutput from "./AnsiOutput";

describe("AnsiOutput", () => {
  it("renders plain text with no ANSI codes", () => {
    const { container } = renderWithProviders(
      <AnsiOutput text="hello world" />,
    );
    expect(container).toHaveTextContent("hello world");
  });

  it("applies foreground color for an ANSI-coded segment", () => {
    renderWithProviders(<AnsiOutput text={"\x1b[0;34mblue text\x1b[0m"} />);
    expect(screen.getByText("blue text")).toHaveStyle({
      color: "rgb(0, 0, 187)",
    });
  });

  it("applies bold decoration for an ANSI-coded segment", () => {
    renderWithProviders(<AnsiOutput text={"\x1b[1mbold text\x1b[0m"} />);
    expect(screen.getByText("bold text")).toHaveStyle({ fontWeight: "700" });
  });
});
