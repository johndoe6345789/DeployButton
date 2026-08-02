// In production, nginx routes same-origin /api/* to the backend, so this is
// left empty. For local `next dev` (no nginx in front), point it at the
// backend directly via NEXT_PUBLIC_API_BASE, e.g. http://localhost:8080.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
