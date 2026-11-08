import { describe, expect, it } from "vitest";

import { createApiClient } from "./client.js";

function recordingFetch(body: unknown) {
  const requests: Request[] = [];
  const fetch = async (request: Request) => {
    requests.push(request);
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  return { fetch, requests };
}

describe("createApiClient", () => {
  it("calls the versioned endpoint with locale and auth headers", async () => {
    const payload = { default_locale: "es", locales: [{ code: "es", name: "Español" }] };
    const { fetch, requests } = recordingFetch(payload);
    const client = createApiClient({
      baseUrl: "https://api.example.test/",
      getLocale: () => "en",
      getAuthHeaders: async () => ({ Authorization: "Bearer token" }),
      fetch,
    });

    const { data, error } = await client.GET("/api/v1/locales", { params: { query: { locale: "en" } } });

    expect(error).toBeUndefined();
    expect(data).toEqual(payload);
    const [request] = requests;
    expect(request?.url).toBe("https://api.example.test/api/v1/locales?locale=en");
    expect(request?.headers.get("Accept-Language")).toBe("en");
    expect(request?.headers.get("Authorization")).toBe("Bearer token");
    expect(request?.headers.get("Accept")).toBe("application/json");
  });

  it("omits optional headers when not configured", async () => {
    const { fetch, requests } = recordingFetch({ status: "ok", database: "ok" });
    const client = createApiClient({ baseUrl: "https://api.example.test", fetch });

    await client.GET("/api/v1/health");

    expect(requests[0]?.headers.has("Accept-Language")).toBe(false);
    expect(requests[0]?.headers.has("Authorization")).toBe(false);
  });
});
