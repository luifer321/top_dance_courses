import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import es from "../../messages/es.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? { ...acc, [path]: value } : { ...acc, ...flatten(value, path) };
  }, {});
}

const placeholders = (message: string) => [...message.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();

const flatEs = flatten(es);
const flatEn = flatten(en);

const REQUIRED_NAMESPACES = [
  "common",
  "navigation",
  "auth",
  "dashboard",
  "courses",
  "lessons",
  "subscriptions",
  "profile",
  "validation",
  "errors",
];

describe("interface messages", () => {
  it("defines the required namespaces", () => {
    expect(Object.keys(es)).toEqual(expect.arrayContaining(REQUIRED_NAMESPACES));
  });

  it("has identical keys in es and en", () => {
    expect(Object.keys(flatEn).sort()).toEqual(Object.keys(flatEs).sort());
  });

  it("has no empty messages", () => {
    for (const [key, value] of Object.entries({ ...flatEs, ...flatEn })) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("uses the same ICU placeholders in both locales", () => {
    for (const key of Object.keys(flatEs)) {
      expect(placeholders(flatEn[key]), key).toEqual(placeholders(flatEs[key]));
    }
  });
});
