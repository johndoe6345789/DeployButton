import { render, screen } from "@testing-library/react";
import { FormField, formInputClass } from "./FormField";

describe("FormField", () => {
  it("renders the label text and children", () => {
    render(
      <FormField label="Name">
        <input aria-label="Name" />
      </FormField>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("exports a non-empty shared input class", () => {
    expect(formInputClass.length).toBeGreaterThan(0);
  });
});
