import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddStepMenu from "./AddStepMenu";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("AddStepMenu", () => {
  it("adds a shell step by default with a generated key", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);
    await userEvent.click(screen.getByTestId("add-step-button"));

    expect(onAdd).toHaveBeenCalledTimes(1);
    const step = onAdd.mock.calls[0][0];
    expect(step.type).toBe("shell");
    expect(step.name).toBe("Shell command");
    expect(typeof step.key).toBe("string");
    expect(step.config).toEqual({});
  });

  it("adds a delay step with a default seconds value", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "delay");
    await userEvent.click(screen.getByTestId("add-step-button"));

    const step = onAdd.mock.calls[0][0];
    expect(step.type).toBe("delay");
    expect(step.config).toEqual({ seconds: 5 });
  });

  it("adds an npm_build step with default manager and script", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "npm_build");
    await userEvent.click(screen.getByTestId("add-step-button"));

    const step = onAdd.mock.calls[0][0];
    expect(step.config).toEqual({ manager: "npm", script: "build" });
  });

  it("adds an npm_install step with a default manager", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "npm_install");
    await userEvent.click(screen.getByTestId("add-step-button"));

    const step = onAdd.mock.calls[0][0];
    expect(step.config).toEqual({ manager: "npm" });
  });

  it("adds an http_webhook step with a default method", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "http_webhook");
    await userEvent.click(screen.getByTestId("add-step-button"));

    const step = onAdd.mock.calls[0][0];
    expect(step.config).toEqual({ method: "POST" });
  });

  it("adds a docker_build step with a default dockerfile", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "docker_build");
    await userEvent.click(screen.getByTestId("add-step-button"));

    const step = onAdd.mock.calls[0][0];
    expect(step.config).toEqual({ dockerfile: "Dockerfile" });
  });

  it("generates distinct keys for successive steps", async () => {
    const onAdd = jest.fn();
    renderWithProviders(<AddStepMenu onAdd={onAdd} />);
    await userEvent.click(screen.getByTestId("add-step-button"));
    await userEvent.click(screen.getByTestId("add-step-button"));

    const firstKey = onAdd.mock.calls[0][0].key;
    const secondKey = onAdd.mock.calls[1][0].key;
    expect(firstKey).not.toBe(secondKey);
  });
});
