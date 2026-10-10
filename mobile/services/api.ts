import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'familyconnect_tokens';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://familyconnect-api.vercel.app/api';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export async function saveTokens(tokens: Tokens): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
}

export async function getTokens(): Promise<Tokens | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function refreshTokens(): Promise<Tokens | null> {
  const tokens = await getTokens();
  if (!tokens) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });

  if (!response.ok) {
    await clearTokens();
    return null;
  }

  const data = await safeParseJson<Partial<Tokens>>(response);
  if (!data?.accessToken || !data?.refreshToken) {
    await clearTokens();
    return null;
  }
  const newTokens: Tokens = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
  await saveTokens(newTokens);
  return newTokens;
}

// Read a response body as JSON without throwing on empty, HTML, or
// otherwise malformed payloads (e.g. a proxy/CDN error page). Returns
// null when the body is not usable JSON.
async function safeParseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const tokens = await getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && tokens?.refreshToken) {
    const newTokens = await refreshTokens();
    if (newTokens) {
      headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    const error = await safeParseJson<{ error?: string }>(response);
    throw new Error(error?.error || `HTTP ${response.status}`);
  }

  const data = await safeParseJson<T>(response);
  if (data === null) {
    throw new Error(`HTTP ${response.status}`);
  }
  return data;
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}