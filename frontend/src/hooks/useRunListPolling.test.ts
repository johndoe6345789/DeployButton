import { renderHook, waitFor } from "@testing-library/react";
import { Providers } from "@/test-utils/renderWithProviders";
import { useRunListPolling } from "./useRunListPolling";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({ api: { listRuns: jest.fn() } }));

describe("useRunListPolling", () => {
  beforeEach(() => (api.listRuns as jest.Mock).mockReset());

  it("fetches once and stops polling when nothing is running", async () => {
    (api.listRuns as jest.Mock).mockResolvedValue([
      { id: 1, status: "success" },
    ]);
    const { result } = renderHook(() => useRunListPolling(3), {
      wrapper: Providers,
    });
    await waitFor(() =>
      expect(result.current.runs).toEqual([{ id: 1, status: "success" }]),
    );
    expect(api.listRuns).toHaveBeenCalledTimes(1);
  });

  it("keeps polling while any run in the list is still running", async () => {
    (api.listRuns as jest.Mock)
      .mockResolvedValueOnce([
        { id: 1, status: "success" },
        { id: 2, status: "running" },
      ])
      .mockResolvedValueOnce([
        { id: 1, status: "success" },
        { id: 2, status: "success" },
      ]);

    const { result } = renderHook(() => useRunListPolling(3), {
      wrapper: Providers,
    });
    await waitFor(
      () =>
        expect(result.current.runs).toEqual([
          { id: 1, status: "success" },
          { id: 2, status: "success" },
        ]),
      { timeout: 3000 },
    );
    expect(api.listRuns).toHaveBeenCalledTimes(2);
  });

  it("sets an error message when the request fails", async () => {
    (api.listRuns as jest.Mock).mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useRunListPolling(3), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.error).toBe("down"));
  });

  it("does not update state after unmount", async () => {
    (api.listRuns as jest.Mock).mockResolvedValue([
      { id: 1, status: "running" },
    ]);
    const { unmount } = renderHook(() => useRunListPolling(3), {
      wrapper: Providers,
    });
    await waitFor(() => expect(api.listRuns).toHaveBeenCalledTimes(1));
    expect(() => unmount()).not.toThrow();
  });
});
