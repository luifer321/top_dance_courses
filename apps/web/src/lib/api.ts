import { createApiClient } from "@top-dance/api-client";

let csrfToken: string | undefined;

export function setCsrfToken(token: string | undefined) {
  csrfToken = token;
}

// The web app authenticates with the Rails session cookie, so requests must
// include credentials (CORS on the API allows the configured origins only).
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  credentials: "include",
  getLocale: () => (typeof document === "undefined" ? undefined : document.documentElement.lang || undefined),
  getAuthHeaders: () => {
    const headers: Record<string, string> = { "X-Auth-Transport": "cookie" };
    if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
    return headers;
  },
});

export async function ensureCsrf() {
  const { data } = await api.GET("/api/v1/auth/csrf");
  csrfToken = data?.csrf_token;
  return csrfToken;
}
