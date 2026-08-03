import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import NotifyFields from "./NotifyFields";

describe("NotifyFields", () => {
  it("renders the message value", () => {
    renderWithProviders(
      <NotifyFields config={{ message: "hi" }} onChange={jest.fn()} />,
    );
    expect(screen.getByDisplayValue("hi")).toBeInTheDocument();
  });

  it("calls onChange when the message changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<NotifyFields config={{}} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Message"), "x");
    expect(onChange).toHaveBeenCalledWith({ message: "x" });
  });

  it("calls onChange when the webhook url changes", async () => {
    const onChange = jest.fn();
    renderWithProviders(<NotifyFields config={{}} onChange={onChange} />);
    await userEvent.type(
      screen.getByLabelText("Webhook URL (optional)"),
      "x",
    );
    expect(onChange).toHaveBeenCalledWith({ webhookUrl: "x" });
  });
});
