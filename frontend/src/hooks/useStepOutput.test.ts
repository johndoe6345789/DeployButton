import { act, renderHook, waitFor } from "@testing-library/react";
import { Providers } from "@/test-utils/renderWithProviders";
import { useStepOutput } from "./useStepOutput";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({ api: { getStepOutput: jest.fn() } }));
const mockedGetStepOutput = api.getStepOutput as jest.Mock;

describe("useStepOutput", () => {
  beforeEach(() => mockedGetStepOutput.mockReset());

  it("fetches the tail chunk on mount", async () => {
    mockedGetStepOutput.mockResolvedValue({
      text: "L5\nL6\n",
      start_offset: 12,
      end_offset: 18,
      total_length: 18,
    });

    const { result } = renderHook(() => useStepOutput(1, false), {
      wrapper: Providers,
    });

    await waitFor(() => expect(result.current.fragments).toHaveLength(1));
    expect(result.current.fragments[0].text).toBe("L5\nL6\n");
    expect(result.current.hasEarlier).toBe(true);
    expect(mockedGetStepOutput).toHaveBeenCalledWith(1, {});
  });

  it("loadEarlier prepends a preceding chunk", async () => {
    mockedGetStepOutput
      .mockResolvedValueOnce({
        text: "L6\n",
        start_offset: 15,
        end_offset: 18,
        total_length: 18,
      })
      .mockResolvedValueOnce({
        text: "L5\n",
        start_offset: 12,
        end_offset: 15,
        total_length: 18,
      });

    const { result } = renderHook(() => useStepOutput(1, false), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.fragments).toHaveLength(1));

    act(() => result.current.loadEarlier());

    await waitFor(() => expect(result.current.fragments).toHaveLength(2));
    expect(result.current.fragments.map((f) => f.text)).toEqual([
      "L5\n",
      "L6\n",
    ]);
    expect(result.current.hasEarlier).toBe(true);
    expect(mockedGetStepOutput).toHaveBeenLastCalledWith(1, { before: 15 });
  });

  it("does not fetch again if loadEarlier is called with no earlier content", async () => {
    mockedGetStepOutput.mockResolvedValue({
      text: "L1\nL2\n",
      start_offset: 0,
      end_offset: 6,
      total_length: 6,
    });
    const { result } = renderHook(() => useStepOutput(1, false), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.hasEarlier).toBe(false));

    act(() => result.current.loadEarlier());

    expect(mockedGetStepOutput).toHaveBeenCalledTimes(1);
  });

  it("polls for new content while isLive is true, appending a new fragment", async () => {
    mockedGetStepOutput
      .mockResolvedValueOnce({
        text: "L1\n",
        start_offset: 0,
        end_offset: 3,
        total_length: 3,
      })
      .mockResolvedValueOnce({
        text: "L2\n",
        start_offset: 3,
        end_offset: 6,
        total_length: 6,
      });

    const { result } = renderHook(() => useStepOutput(1, true), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.fragments).toHaveLength(2), {
      timeout: 3000,
    });

    expect(result.current.fragments.map((f) => f.text)).toEqual([
      "L1\n",
      "L2\n",
    ]);
    expect(mockedGetStepOutput).toHaveBeenLastCalledWith(1, { after: 3 });
  });

  it("stops polling shortly after isLive becomes false", async () => {
    mockedGetStepOutput.mockResolvedValue({
      text: "L1\n",
      start_offset: 0,
      end_offset: 3,
      total_length: 3,
    });

    const { rerender } = renderHook(
      ({ isLive }) => useStepOutput(1, isLive),
      { wrapper: Providers, initialProps: { isLive: true } },
    );
    await waitFor(() => expect(mockedGetStepOutput).toHaveBeenCalledTimes(1));

    rerender({ isLive: false });

    // The poll already scheduled before the flip still fires once (isLive
    // is only checked when deciding whether to schedule the *next* one),
    // but no further tick should follow it.
    await waitFor(() => expect(mockedGetStepOutput).toHaveBeenCalledTimes(2), {
      timeout: 3000,
    });
    const callsAfterFlip = mockedGetStepOutput.mock.calls.length;

    await new Promise((resolve) => setTimeout(resolve, 1800));
    expect(mockedGetStepOutput.mock.calls.length).toBe(callsAfterFlip);
  }, 8000);

  it("sets an error message when a request fails", async () => {
    mockedGetStepOutput.mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useStepOutput(1, false), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.error).toBe("down"));
  });

  it("does not update state after unmount", async () => {
    mockedGetStepOutput.mockResolvedValue({
      text: "L1\n",
      start_offset: 0,
      end_offset: 3,
      total_length: 3,
    });
    const { unmount } = renderHook(() => useStepOutput(1, true), {
      wrapper: Providers,
    });
    await waitFor(() => expect(mockedGetStepOutput).toHaveBeenCalledTimes(1));
    expect(() => unmount()).not.toThrow();
  });
});
