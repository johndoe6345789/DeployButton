import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders Running for running status", () => {
    render(<StatusBadge status="running" />);
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("renders Success for success status", () => {
    render(<StatusBadge status="success" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders Failed for failed status", () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders Skipped for skipped status", () => {
    render(<StatusBadge status="skipped" />);
    expect(screen.getByText("Skipped")).toBeInTheDocument();
  });

  it("renders Never run for null status", () => {
    render(<StatusBadge status={null} />);
    expect(screen.getByText("Never run")).toBeInTheDocument();
  });

  it("renders Never run for undefined status", () => {
    render(<StatusBadge status={undefined} />);
    expect(screen.getByText("Never run")).toBeInTheDocument();
  });
});
