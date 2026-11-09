import { createApiClient, type AuthSession } from "@top-dance/api-client";

import { config } from "@/config";
import i18n from "@/i18n";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./session";

const AUTH_PATH = /\/api\/v1\/auth\/(login|register|google|refresh|password)/;

let refreshInFlight: Promise<boolean> | null = null;

function tokenHeaders(accessToken: string | null) {
  const headers: Record<string, string> = { "X-Auth-Transport": "token" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  return headers;
}

const refreshClient = createApiClient({
  baseUrl: config.apiUrl,
  credentials: "omit",
  getLocale: () => i18n.language,
  getAuthHeaders: () => tokenHeaders(null),
});

export async function refreshSession() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    const { data } = await refreshClient.POST("/api/v1/auth/refresh", { body: { refresh_token: refreshToken } });
    if (!data?.access_token || !data.refresh_token) {
      await clearTokens();
      return false;
    }
    await setTokens(data.access_token, data.refresh_token);
    return true;
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function fetchWithRefresh(request: Request) {
  const response = await fetch(request);
  if (
    response.status !== 401 ||
    AUTH_PATH.test(request.url) ||
    request.headers.get("X-Retry-After-Refresh")
  ) {
    return response;
  }

  const refreshed = await refreshSession();
  if (!refreshed) return response;

  const headers = new Headers(request.headers);
  const accessToken = await getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("X-Retry-After-Refresh", "1");
  return fetch(new Request(request, { headers }));
}

export const api = createApiClient({
  baseUrl: config.apiUrl,
  credentials: "omit",
  getLocale: () => i18n.language,
  getAuthHeaders: async () => tokenHeaders(await getAccessToken()),
  fetch: fetchWithRefresh,
});

export async function persistSession(session: AuthSession) {
  if (session.access_token && session.refresh_token) {
    await setTokens(session.access_token, session.refresh_token);
  }
}
