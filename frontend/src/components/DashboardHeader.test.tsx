import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardHeader from "./DashboardHeader";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("DashboardHeader", () => {
  it("renders the title and Workflows link", () => {
    renderWithProviders(<DashboardHeader onNewProject={jest.fn()} />);
    expect(screen.getByText("DeployButton")).toBeInTheDocument();
    expect(screen.getByText("Workflows").closest("a")).toHaveAttribute(
      "href",
      "/workflows",
    );
  });

  it("calls onNewProject when the button is clicked", async () => {
    const onNewProject = jest.fn();
    renderWithProviders(<DashboardHeader onNewProject={onNewProject} />);
    await userEvent.click(screen.getByTestId("new-project-button"));
    expect(onNewProject).toHaveBeenCalledTimes(1);
  });
});
