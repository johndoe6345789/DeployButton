import { renderHook, waitFor } from "@testing-library/react";
import { useRunPolling } from "./useRunPolling";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({ api: { getRun: jest.fn() } }));

describe("useRunPolling", () => {
  beforeEach(() => (api.getRun as jest.Mock).mockReset());

  it("fetches once and stops polling when the run is terminal", async () => {
    (api.getRun as jest.Mock).mockResolvedValue({ status: "success" });
    const { result } = renderHook(() => useRunPolling(1));
    await waitFor(() =>
      expect(result.current.run).toEqual({ status: "success" }),
    );
    expect(api.getRun).toHaveBeenCalledTimes(1);
  });

  it("polls again while the run is still running", async () => {
    (api.getRun as jest.Mock)
      .mockResolvedValueOnce({ status: "running" })
      .mockResolvedValueOnce({ status: "success" });

    const { result } = renderHook(() => useRunPolling(1));
    await waitFor(
      () => expect(result.current.run).toEqual({ status: "success" }),
      { timeout: 3000 },
    );
    expect(api.getRun).toHaveBeenCalledTimes(2);
  });

  it("sets an error message when the request fails", async () => {
    (api.getRun as jest.Mock).mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useRunPolling(1));
    await waitFor(() => expect(result.current.error).toBe("down"));
  });

  it("does not update state after unmount", async () => {
    (api.getRun as jest.Mock).mockResolvedValue({ status: "running" });
    const { unmount } = renderHook(() => useRunPolling(1));
    await waitFor(() => expect(api.getRun).toHaveBeenCalledTimes(1));
    expect(() => unmount()).not.toThrow();
  });

  it("ignores a successful response that resolves after unmount", async () => {
    let resolvePoll: (v: { status: string }) => void = () => {};
    (api.getRun as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolvePoll = resolve;
      }),
    );
    const { result, unmount } = renderHook(() => useRunPolling(1));
    unmount();
    resolvePoll({ status: "success" });
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.run).toBeNull();
  });

  it("ignores a rejection that arrives after unmount", async () => {
    let rejectPoll: (e: unknown) => void = () => {};
    (api.getRun as jest.Mock).mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectPoll = reject;
      }),
    );
    const { result, unmount } = renderHook(() => useRunPolling(1));
    unmount();
    rejectPoll(new Error("down"));
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.error).toBeNull();
  });
});
