import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import RunHistoryHeader from "./RunHistoryHeader";

describe("RunHistoryHeader", () => {
  it("shows a generic title when no project is loaded yet", () => {
    renderWithProviders(<RunHistoryHeader project={null} />);
    expect(screen.getByText("Run History")).toBeInTheDocument();
  });

  it("shows the project name once loaded", () => {
    renderWithProviders(
      <RunHistoryHeader
        project={{
          id: 1,
          name: "My App",
          slug: "my-app",
          repo_url: null,
          workflow_id: 1,
          workflow_name: "React",
          last_run_status: null,
          last_run_started_at: null,
          last_run_finished_at: null,
        }}
      />,
    );
    expect(screen.getByText("My App — Run History")).toBeInTheDocument();
  });

  it("links back to the dashboard", () => {
    renderWithProviders(<RunHistoryHeader project={null} />);
    expect(screen.getByTestId("back-to-dashboard")).toHaveAttribute(
      "href",
      "/",
    );
  });
});
