import { renderHook, waitFor, act } from "@testing-library/react";
import { useProjects } from "./useProjects";
import { api } from "@/api/client";
import { Providers } from "@/test-utils/renderWithProviders";

jest.mock("@/api/client", () => ({ api: { listProjects: jest.fn() } }));

describe("useProjects", () => {
  beforeEach(() => (api.listProjects as jest.Mock).mockReset());

  it("loads projects on mount", async () => {
    (api.listProjects as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const { result } = renderHook(() => useProjects(), { wrapper: Providers });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.projects).toEqual([{ id: 1 }]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when loading fails", async () => {
    (api.listProjects as jest.Mock).mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useProjects(), { wrapper: Providers });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("down");
  });

  it("uses a fallback error message for a non-Error rejection", async () => {
    (api.listProjects as jest.Mock).mockRejectedValue("boom");
    const { result } = renderHook(() => useProjects(), { wrapper: Providers });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Failed to load");
  });

  it("refresh reloads and clears the previous error", async () => {
    (api.listProjects as jest.Mock)
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce([{ id: 2 }]);
    const { result } = renderHook(() => useProjects(), { wrapper: Providers });
    await waitFor(() => expect(result.current.error).toBe("down"));

    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.projects).toEqual([{ id: 2 }]));
    expect(result.current.error).toBeNull();
  });
});
