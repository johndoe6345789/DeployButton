import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import HttpWebhookFields from "./HttpWebhookFields";

describe("HttpWebhookFields", () => {
  it("defaults the method to POST", () => {
    renderWithProviders(<HttpWebhookFields config={{}} onChange={jest.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("POST");
  });

  it("calls onChange when the url changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<HttpWebhookFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("URL"), "x");
    expect(onChange).toHaveBeenCalledWith({ url: "x" });
  });

  it("calls onChange when the method changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<HttpWebhookFields config={{}} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "GET");
    expect(onChange).toHaveBeenCalledWith({ method: "GET" });
  });

  it("calls onChange when the body changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<HttpWebhookFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Body (optional)"), "x");
    expect(onChange).toHaveBeenCalledWith({ body: "x" });
  });
});
