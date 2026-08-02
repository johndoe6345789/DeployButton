import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardHeader from "./DashboardHeader";

describe("DashboardHeader", () => {
  it("renders the title and Workflows link", () => {
    render(<DashboardHeader onNewProject={jest.fn()} />);
    expect(screen.getByText("DeployButton")).toBeInTheDocument();
    expect(screen.getByText("Workflows").closest("a")).toHaveAttribute(
      "href",
      "/workflows",
    );
  });

  it("calls onNewProject when the button is clicked", async () => {
    const onNewProject = jest.fn();
    render(<DashboardHeader onNewProject={onNewProject} />);
    await userEvent.click(screen.getByText("New Project"));
    expect(onNewProject).toHaveBeenCalledTimes(1);
  });
});
