import { request } from "./http";

describe("request", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns parsed JSON on success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ hello: "world" }),
    }) as unknown as typeof fetch;

    const result = await request<{ hello: string }>("/api/thing");
    expect(result).toEqual({ hello: "world" });
    expect(fetch).toHaveBeenCalledWith(
      "/api/thing",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("returns undefined for 204 No Content", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => {
        throw new Error("should not be called");
      },
    }) as unknown as typeof fetch;

    const result = await request<void>("/api/thing", { method: "DELETE" });
    expect(result).toBeUndefined();
  });

  it("throws with status and body text on non-ok response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () => "name is required",
    }) as unknown as typeof fetch;

    await expect(request("/api/thing")).rejects.toThrow(
      "400 Bad Request: name is required",
    );
  });

  it("merges custom headers with the default Content-Type", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    await request("/api/thing", { headers: { "X-Test": "1" } });
    expect(fetch).toHaveBeenCalledWith(
      "/api/thing",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Test": "1",
        }),
      }),
    );
  });
});
