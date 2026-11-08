import { createApiClient } from "@top-dance/api-client";

// The web app authenticates with the Rails session cookie, so requests must
// include credentials (CORS on the API allows the configured origins only).
export const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  credentials: "include",
  getLocale: () => (typeof document === "undefined" ? undefined : document.documentElement.lang || undefined),
});
