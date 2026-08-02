import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeployButton from "./DeployButton";
import { api } from "@/api/client";

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
    render(<DeployButton projectId={3} />);

    await userEvent.click(screen.getByText("Deploy"));

    expect(api.deploy).toHaveBeenCalledWith(3);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/runs/7"));
  });

  it("shows an error message and re-enables the button on failure", async () => {
    (api.deploy as jest.Mock).mockRejectedValue(new Error("boom"));
    render(<DeployButton projectId={3} />);

    await userEvent.click(screen.getByText("Deploy"));

    expect(await screen.findByText("boom")).toBeInTheDocument();
    expect(screen.getByText("Deploy")).not.toBeDisabled();
  });

  it("shows a fallback error message for a non-Error rejection", async () => {
    (api.deploy as jest.Mock).mockRejectedValue("boom");
    render(<DeployButton projectId={3} />);

    await userEvent.click(screen.getByText("Deploy"));

    expect(await screen.findByText("Deploy failed")).toBeInTheDocument();
  });

  it("disables the button and shows Deploying... while in flight", async () => {
    let resolveDeploy: (v: { runId: number }) => void = () => {};
    (api.deploy as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveDeploy = resolve;
      }),
    );
    render(<DeployButton projectId={3} />);

    await userEvent.click(screen.getByText("Deploy"));
    expect(await screen.findByText("Deploying...")).toBeDisabled();

    resolveDeploy({ runId: 1 });
    await waitFor(() => expect(pushMock).toHaveBeenCalled());
  });
});
