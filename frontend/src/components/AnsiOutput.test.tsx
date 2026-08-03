import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import AnsiOutput from "./AnsiOutput";

describe("AnsiOutput", () => {
  it("renders plain text with no ANSI codes", () => {
    renderWithProviders(<AnsiOutput text="hello world" />);
    expect(screen.getByTestId("ansi-output")).toHaveTextContent(
      "hello world",
    );
  });

  it("applies foreground color for an ANSI-coded segment", () => {
    renderWithProviders(<AnsiOutput text={"[0;34mblue text[0m"} />);
    expect(screen.getByText("blue text")).toHaveStyle({
      color: "rgb(0, 0, 187)",
    });
  });

  it("applies bold decoration for an ANSI-coded segment", () => {
    renderWithProviders(<AnsiOutput text={"[1mbold text[0m"} />);
    expect(screen.getByText("bold text")).toHaveStyle({ fontWeight: "700" });
  });

  it("scrolls the container to the bottom when text changes", () => {
    const { container, rerender } = renderWithProviders(
      <AnsiOutput text="line1" />,
    );
    const pre = container.querySelector("pre") as HTMLPreElement;
    Object.defineProperty(pre, "scrollHeight", {
      value: 500,
      configurable: true,
    });
    pre.scrollTop = 0;

    rerender(<AnsiOutput text={"line1\nline2"} />);

    expect(pre.scrollTop).toBe(500);
  });
});
