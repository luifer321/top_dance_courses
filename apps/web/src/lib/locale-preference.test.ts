import { describe, expect, it } from "vitest";
import { detectBrowserLocale } from "./locale-preference";
import { pathSegmentsAfterLocale } from "./use-route-params";

describe("detectBrowserLocale", () => {
  it("matches the first supported base language", () => {
    expect(detectBrowserLocale(["en-US", "es-MX"])).toBe("en");
    expect(detectBrowserLocale(["fr-FR", "es-CO"])).toBe("es");
  });

  it("falls back to Spanish", () => {
    expect(detectBrowserLocale(["de-DE"])).toBe("es");
    expect(detectBrowserLocale([])).toBe("es");
  });
});

describe("pathSegmentsAfterLocale", () => {
  it("strips the locale and decodes segments", () => {
    expect(pathSegmentsAfterLocale("/es/cursos/salsa%20b%C3%A1sica/")).toEqual(["cursos", "salsa básica"]);
    expect(pathSegmentsAfterLocale("/en/courses/x/lessons/y/")).toEqual(["courses", "x", "lessons", "y"]);
  });
});
