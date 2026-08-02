import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/types";

jest.mock("@/api/client", () => ({ api: { deploy: jest.fn() } }));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 1,
    name: "My App",
    slug: "my-app",
    repo_url: null,
    workflow_id: 2,
    workflow_name: "React via CapRover",
    last_run_status: null,
    last_run_started_at: null,
    last_run_finished_at: null,
    ...overrides,
  };
}

describe("ProjectCard", () => {
  it("renders the project name and workflow name", () => {
    render(<ProjectCard project={makeProject()} />);
    expect(screen.getByText("My App")).toBeInTheDocument();
    expect(
      screen.getByText("React via CapRover", { exact: false }),
    ).toBeInTheDocument();
  });

  it("links to the project's run history", () => {
    render(<ProjectCard project={makeProject()} />);
    expect(screen.getByText("My App").closest("a")).toHaveAttribute(
      "href",
      "/projects/1/runs",
    );
  });

  it("shows a relative last-run time when finished_at is set", () => {
    const recentIso = new Date(Date.now() - 60_000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    render(
      <ProjectCard
        project={makeProject({
          last_run_status: "success",
          last_run_finished_at: recentIso,
        })}
      />,
    );
    expect(screen.getByText(/last run/)).toBeInTheDocument();
  });

  it("shows the Never run status badge when never deployed", () => {
    render(<ProjectCard project={makeProject()} />);
    expect(screen.getByText("Never run")).toBeInTheDocument();
  });

  it("shows an hours-ago last-run time", () => {
    const iso = new Date(Date.now() - 2 * 3600_000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    render(
      <ProjectCard
        project={makeProject({
          last_run_status: "success",
          last_run_finished_at: iso,
        })}
      />,
    );
    expect(screen.getByText(/last run 2h ago/)).toBeInTheDocument();
  });

  it("shows a days-ago last-run time", () => {
    const iso = new Date(Date.now() - 2 * 86400_000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    render(
      <ProjectCard
        project={makeProject({
          last_run_status: "success",
          last_run_finished_at: iso,
        })}
      />,
    );
    expect(screen.getByText(/last run 2d ago/)).toBeInTheDocument();
  });

  it("falls back to last_run_started_at when finished_at is null", () => {
    const iso = new Date(Date.now() - 30_000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    render(
      <ProjectCard
        project={makeProject({
          last_run_status: "running",
          last_run_started_at: iso,
        })}
      />,
    );
    expect(screen.getByText(/last run \d+s ago/)).toBeInTheDocument();
  });
});
