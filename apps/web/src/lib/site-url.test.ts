import { afterEach, describe, expect, it } from "vitest";
import { absoluteAsset, absoluteUrl, siteOrigin } from "./site-url";

describe("site URL", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  });

  it("reads one origin and strips a trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://topdance.example/";
    expect(siteOrigin()).toBe("https://topdance.example");
  });

  it("builds a self-canonical URL without a query or fragment", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://topdance.example";
    expect(absoluteUrl("/es/cursos?utm=1#top")).toBe("https://topdance.example/es/cursos/");
    expect(absoluteUrl("/en/courses/basic-salsa")).toBe("https://topdance.example/en/courses/basic-salsa/");
  });

  it("keeps an absolute cover URL and prefixes a site path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://topdance.example";
    expect(absoluteAsset("https://cdn.example/cover.jpg")).toBe("https://cdn.example/cover.jpg");
    expect(absoluteAsset("/catalog/salsa-basics.svg")).toBe("https://topdance.example/catalog/salsa-basics.svg");
  });
});
