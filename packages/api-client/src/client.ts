import createClient from "openapi-fetch";

import type { components, paths } from "./generated/schema.js";

type MaybePromise<T> = T | Promise<T>;

export type ApiClientOptions = {
  /** API origin, e.g. https://api.topdance.academy (without /api/v1). */
  baseUrl: string;
  /** Interface language sent as Accept-Language so API messages are localized. */
  getLocale?: () => string | undefined;
  /** Web uses cookies (credentials: "include"); mobile returns a bearer token here. */
  getAuthHeaders?: () => MaybePromise<Record<string, string> | undefined>;
  credentials?: "include" | "same-origin" | "omit";
  /** Override for tests or custom networking; defaults to the global fetch. */
  fetch?: (request: Request) => Promise<Response>;
};

export function createApiClient({ baseUrl, getLocale, getAuthHeaders, credentials, fetch }: ApiClientOptions) {
  const client = createClient<paths>({
    baseUrl: baseUrl.replace(/\/+$/, ""),
    credentials,
    fetch,
    headers: { Accept: "application/json" },
  });

  client.use({
    async onRequest({ request }) {
      const locale = getLocale?.();
      if (locale) request.headers.set("Accept-Language", locale);

      const authHeaders = await getAuthHeaders?.();
      for (const [name, value] of Object.entries(authHeaders ?? {})) {
        request.headers.set(name, value);
      }
      return request;
    },
  });

  return client;
}

export type ApiClient = ReturnType<typeof createApiClient>;
export type Schemas = components["schemas"];
export type ApiError = Schemas["Error"];
export type LocaleCode = Schemas["LocaleCode"];
export type LocaleList = Schemas["LocaleList"];
export type Health = Schemas["Health"];
