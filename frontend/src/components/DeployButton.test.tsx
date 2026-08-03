import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeployButton from "./DeployButton";
import { api } from "@/api/client";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));
jest.mock("@/api/client", () => ({ api: { deploy: jest.fn() } }));

describe("DeployButton", () => {
  beforeEach(() => {
    pushMock.mockReset();
    (api.deploy as jest.Mock).mockReset();
  });

  it("deploys and navigates to the run page on success", async () => {
    (api.deploy as jest.Mock).mockResolvedValue({ runId: 7 });
    renderWithProviders(<DeployButton projectId={3} />);
    await userEvent.click(screen.getByTestId("deploy-button"));
    expect(api.deploy).toHaveBeenCalledWith(3);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/runs/7"));
  });

  it("shows an error message and re-enables the button on failure", async () => {
    (api.deploy as jest.Mock).mockRejectedValue(new Error("boom"));
    renderWithProviders(<DeployButton projectId={3} />);
    await userEvent.click(screen.getByTestId("deploy-button"));
    expect(await screen.findByTestId("deploy-error")).toHaveTextContent(
      "boom",
    );
    expect(screen.getByTestId("deploy-button")).not.toBeDisabled();
  });

  it("disables the button and shows Deploying... while in flight", async () => {
    let resolveDeploy: (v: { runId: number }) => void = () => {};
    (api.deploy as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveDeploy = resolve;
      }),
    );
    renderWithProviders(<DeployButton projectId={3} />);
    await userEvent.click(screen.getByTestId("deploy-button"));
    expect(await screen.findByText("Deploying...")).toBeDisabled();
    resolveDeploy({ runId: 1 });
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });

  it("shows a fallback error message for a non-Error rejection", async () => {
    (api.deploy as jest.Mock).mockRejectedValue("boom");
    renderWithProviders(<DeployButton projectId={3} />);
    await userEvent.click(screen.getByTestId("deploy-button"));
    expect(await screen.findByText("Deploy failed")).toBeInTheDocument();
  });
});
