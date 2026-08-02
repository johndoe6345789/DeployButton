import { renderHook, waitFor, act } from "@testing-library/react";
import { useCreateProjectForm } from "./useCreateProjectForm";
import { api } from "@/api/client";
import { Providers } from "@/test-utils/renderWithProviders";

jest.mock("@/api/client", () => ({
  api: { listWorkflows: jest.fn(), createProject: jest.fn() },
}));

describe("useCreateProjectForm", () => {
  beforeEach(() => {
    (api.listWorkflows as jest.Mock).mockReset();
    (api.createProject as jest.Mock).mockReset();
  });

  it("preselects the first loaded workflow", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([
      { id: 5 },
      { id: 6 },
    ]);
    const { result } = renderHook(() => useCreateProjectForm(jest.fn()), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.workflowId).toBe(5));
  });

  it("leaves workflowId null when there are no workflows", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useCreateProjectForm(jest.fn()), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.workflows).toEqual([]));
    expect(result.current.workflowId).toBeNull();
  });

  it("sets an error if a workflow is not chosen on submit", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useCreateProjectForm(jest.fn()), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.workflows).toEqual([]));

    await act(async () => {
      await result.current.submit({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });
    expect(result.current.error).toBe("Choose a workflow");
  });

  it("submits and calls onCreated on success", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (api.createProject as jest.Mock).mockResolvedValue({ id: 9 });
    const onCreated = jest.fn();
    const { result } = renderHook(() => useCreateProjectForm(onCreated), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.workflowId).toBe(1));

    act(() => result.current.setName("App"));
    act(() => result.current.setSlug("app"));

    await act(async () => {
      await result.current.submit({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(api.createProject).toHaveBeenCalledWith({
      name: "App",
      slug: "app",
      repo_url: "",
      workflow_id: 1,
    });
    expect(onCreated).toHaveBeenCalledWith({ id: 9 });
  });

  it("uses a fallback error when loading workflows fails with a non-Error", async () => {
    (api.listWorkflows as jest.Mock).mockRejectedValue("boom");
    const { result } = renderHook(() => useCreateProjectForm(jest.fn()), {
      wrapper: Providers,
    });
    await waitFor(() =>
      expect(result.current.error).toBe("Failed to load workflows"),
    );
  });

  it("uses a fallback error when submit fails with a non-Error", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (api.createProject as jest.Mock).mockRejectedValue("boom");
    const { result } = renderHook(() => useCreateProjectForm(jest.fn()), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.workflowId).toBe(1));

    await act(async () => {
      await result.current.submit({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe("Failed to create project");
  });

  it("sets an error and re-enables submitting on failure", async () => {
    (api.listWorkflows as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (api.createProject as jest.Mock).mockRejectedValue(new Error("nope"));
    const { result } = renderHook(() => useCreateProjectForm(jest.fn()), {
      wrapper: Providers,
    });
    await waitFor(() => expect(result.current.workflowId).toBe(1));

    await act(async () => {
      await result.current.submit({
        preventDefault: () => {},
      } as unknown as React.FormEvent);
    });

    expect(result.current.error).toBe("nope");
    expect(result.current.submitting).toBe(false);
  });
});
