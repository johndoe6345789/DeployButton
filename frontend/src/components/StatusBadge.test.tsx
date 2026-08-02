import { screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";
import { renderWithProviders } from "@/test-utils/renderWithProviders";

describe("StatusBadge", () => {
  it("renders Running for running status", () => {
    renderWithProviders(<StatusBadge status="running" />);
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("renders Success for success status", () => {
    renderWithProviders(<StatusBadge status="success" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders Failed for failed status", () => {
    renderWithProviders(<StatusBadge status="failed" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders Skipped for skipped status", () => {
    renderWithProviders(<StatusBadge status="skipped" />);
    expect(screen.getByText("Skipped")).toBeInTheDocument();
  });

  it("renders Never run for null status", () => {
    renderWithProviders(<StatusBadge status={null} />);
    expect(screen.getByText("Never run")).toBeInTheDocument();
  });

  it("renders Never run for undefined status", () => {
    renderWithProviders(<StatusBadge status={undefined} />);
    expect(screen.getByText("Never run")).toBeInTheDocument();
  });

  it("exposes a data-testid for the badge", () => {
    renderWithProviders(<StatusBadge status="success" />);
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
  });
});
