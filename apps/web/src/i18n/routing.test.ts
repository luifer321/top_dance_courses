import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { defaultLocale, isLocale, locales, routing } from "./routing";

const APP_LOCALE_DIR = join(__dirname, "..", "app", "[locale]");

// Collect URL paths of route folders that contain a page, ignoring (groups).
function routeFolders(dir: string, segments: string[] = []): string[] {
  const found: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  if (entries.some((e) => e.isFile() && /^page\.(dev\.)?tsx$/.test(e.name))) {
    found.push(`/${segments.join("/")}`);
  }
  for (const entry of entries.filter((e) => e.isDirectory())) {
    const isGroup = entry.name.startsWith("(");
    found.push(...routeFolders(join(dir, entry.name), isGroup ? segments : [...segments, entry.name]));
  }
  return found;
}

describe("routing", () => {
  it("uses Spanish as the default locale and supports English", () => {
    expect(defaultLocale).toBe("es");
    expect(locales).toEqual(["es", "en"]);
    expect(routing.localePrefix).toBe("always");
  });

  it("validates locale codes", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("has a route folder for every localized pathname", () => {
    expect(existsSync(APP_LOCALE_DIR)).toBe(true);
    const folders = new Set(routeFolders(APP_LOCALE_DIR));

    for (const [internal, localized] of Object.entries(routing.pathnames)) {
      for (const locale of locales) {
        const path = typeof localized === "string" ? localized : localized[locale];
        expect(folders, `${internal} (${locale}) -> ${path}`).toContain(path);
      }
    }
  });
});
