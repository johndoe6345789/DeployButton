import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManagerSelect, set } from "./shared";

describe("set", () => {
  it("returns a new object with the key updated", () => {
    const original = { a: 1 };
    const result = set(original, "b", 2);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(result).not.toBe(original);
  });
});

describe("ManagerSelect", () => {
  it("renders npm/yarn/pnpm options and reflects the value", () => {
    render(<ManagerSelect value="yarn" onChange={jest.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("yarn");
    expect(screen.getByText("pnpm")).toBeInTheDocument();
  });

  it("calls onChange when a new manager is selected", async () => {
    const onChange = jest.fn();
    render(<ManagerSelect value="npm" onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "pnpm");
    expect(onChange).toHaveBeenCalledWith("pnpm");
  });
});
