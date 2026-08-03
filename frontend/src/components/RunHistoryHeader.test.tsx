import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import RunHistoryHeader from "./RunHistoryHeader";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/api/client", () => ({ api: { deploy: jest.fn() } }));

describe("RunHistoryHeader", () => {
  it("shows a generic title when no project is loaded yet", () => {
    renderWithProviders(<RunHistoryHeader project={null} projectId={1} />);
    expect(screen.getByText("Run History")).toBeInTheDocument();
  });

  it("shows the project name once loaded", () => {
    renderWithProviders(
      <RunHistoryHeader
        projectId={1}
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
    renderWithProviders(<RunHistoryHeader project={null} projectId={1} />);
    expect(screen.getByTestId("back-to-dashboard")).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders a deploy button for the project", () => {
    renderWithProviders(<RunHistoryHeader project={null} projectId={1} />);
    expect(screen.getByTestId("deploy-button")).toBeInTheDocument();
  });
});
