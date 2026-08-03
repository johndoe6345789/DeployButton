import { renderHook, waitFor, act } from "@testing-library/react";
import type { DragEndEvent } from "@dnd-kit/core";
import { Providers } from "@/test-utils/renderWithProviders";
import { useWorkflowEditor } from "./useWorkflowEditor";
import { api } from "@/api/client";

jest.mock("@/api/client", () => ({
  api: {
    getWorkflow: jest.fn(),
    updateWorkflow: jest.fn(),
    updateWorkflowSteps: jest.fn(),
  },
}));

function makeWorkflow() {
  return {
    id: 1,
    name: "W",
    description: "d",
    is_template: false,
    steps: [
      { id: 10, position: 0, name: "A", type: "shell", config: {} },
      { id: 11, position: 1, name: "B", type: "delay", config: {} },
    ],
  };
}

describe("useWorkflowEditor", () => {
  beforeEach(() => {
    (api.getWorkflow as jest.Mock).mockReset();
    (api.updateWorkflow as jest.Mock).mockReset();
    (api.updateWorkflowSteps as jest.Mock).mockReset();
  });

  it("loads the workflow and maps steps to editable steps", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.name).toBe("W");
    expect(result.current.steps).toEqual([
      { key: "10", name: "A", type: "shell", config: {} },
      { key: "11", name: "B", type: "delay", config: {} },
    ]);
  });

  it("defaults description to an empty string when missing", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue({
      id: 1,
      name: "W",
      description: undefined,
      is_template: false,
      steps: [],
    });
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.description).toBe("");
  });

  it("sets an error when loading fails", async () => {
    (api.getWorkflow as jest.Mock).mockRejectedValue(new Error("down"));
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("down");
  });

  it("reorders steps on drag end", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleDragEnd({
        active: { id: "10" },
        over: { id: "11" },
      } as unknown as DragEndEvent);
    });

    expect(result.current.steps.map((s) => s.key)).toEqual(["11", "10"]);
  });

  it("ignores drag end when there is no drop target", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.handleDragEnd({
        active: { id: "10" },
        over: null,
      } as unknown as DragEndEvent);
    });

    expect(result.current.steps.map((s) => s.key)).toEqual(["10", "11"]);
  });

  it("saves the workflow and its steps, then reports saved", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    (api.updateWorkflow as jest.Mock).mockResolvedValue({});
    (api.updateWorkflowSteps as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(api.updateWorkflow).toHaveBeenCalledWith(1, {
      name: "W",
      description: "d",
    });
    expect(api.updateWorkflowSteps).toHaveBeenCalledWith(1, [
      { name: "A", type: "shell", config: {} },
      { name: "B", type: "delay", config: {} },
    ]);
    expect(result.current.saved).toBe(true);
  });

  it("sets an error and clears saving state when save fails", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    (api.updateWorkflow as jest.Mock).mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.error).toBe("nope");
    expect(result.current.saving).toBe(false);
  });

  it("uses a fallback error when save fails with a non-Error", async () => {
    (api.getWorkflow as jest.Mock).mockResolvedValue(makeWorkflow());
    (api.updateWorkflow as jest.Mock).mockRejectedValue("boom");
    const { result } = renderHook(() => useWorkflowEditor(1), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.error).toBe("Failed to save");
  });
});
