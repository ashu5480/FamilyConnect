/**
 * Web-safe API client. Uses the same base URL as the mobile app so the web
 * site and the Expo app share one backend.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://familyconnect-api.vercel.app/api';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => fetchJson<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown) => fetchJson<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) => fetchJson<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) => fetchJson<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => fetchJson<T>(path, { method: 'DELETE' }),
};

export function getApiBaseUrl(): string {
  return API_BASE;
}
