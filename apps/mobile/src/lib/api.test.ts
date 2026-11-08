import { createApiClient } from "@top-dance/api-client";

describe("@top-dance/api-client in React Native", () => {
  it("sends the interface language to the API", async () => {
    const fetch = jest.fn(async (_request: Request) =>
      new Response(JSON.stringify({ status: "ok", database: "ok" }), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    const client = createApiClient({ baseUrl: "http://localhost:3001", getLocale: () => "es", fetch });

    const { data } = await client.GET("/api/v1/health");

    expect(data).toEqual({ status: "ok", database: "ok" });
    expect(fetch.mock.calls[0]?.[0].headers.get("Accept-Language")).toBe("es");
  });
});
