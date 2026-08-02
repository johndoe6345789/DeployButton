import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import DelayFields from "./DelayFields";

describe("DelayFields", () => {
  it("renders the seconds value", () => {
    renderWithProviders(
      <DelayFields config={{ seconds: 15 }} onChange={jest.fn()} />,
    );
    expect(screen.getByDisplayValue("15")).toBeInTheDocument();
  });

  it("calls onChange with a numeric seconds value", async () => {
    const onChange = jest.fn();
    renderWithProviders(
      <DelayFields config={{ seconds: 0 }} onChange={onChange} />,
    );
    await userEvent.clear(screen.getByRole("spinbutton"));
    await userEvent.type(screen.getByRole("spinbutton"), "9");
    expect(onChange).toHaveBeenLastCalledWith({ seconds: 9 });
  });
});
