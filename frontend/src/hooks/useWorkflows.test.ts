import { renderHook, waitFor, act } from "@testing-library/react";
import { useWorkflows } from "./useWorkflows";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({ api: { listWorkflows: jest.fn() } }));

describe("useWorkflows", () => {
  beforeEach(() => (api.listWorkflows as jest.Mock).mockReset());

  it("loads workflows on mount", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const { result } = renderHook(() => useWorkflows());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.workflows).toEqual([{ id: 1 }]);
  });

  it("sets an error message when loading fails", async () => {
    (api.listWorkflows as jest.Mock).mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useWorkflows());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("down");
  });

  it("uses a fallback error message for a non-Error rejection", async () => {
    (api.listWorkflows as jest.Mock).mockRejectedValue("boom");
    const { result } = renderHook(() => useWorkflows());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load");
  });

  it("refresh reloads the list", async () => {
    (api.listWorkflows as jest.Mock)
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    const { result } = renderHook(() => useWorkflows());
    await waitFor(() => expect(result.current.workflows).toHaveLength(1));

    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.workflows).toHaveLength(2));
  });
});
