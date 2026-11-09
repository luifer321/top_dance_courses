import { readFileSync } from "node:fs";
import { join } from "node:path";

import en from "./locales/en.json";
import es from "./locales/es.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? { ...acc, [path]: value } : { ...acc, ...flatten(value, path) };
  }, {});
}

const webMessages = (locale: string): Record<string, string> =>
  flatten(JSON.parse(readFileSync(join(__dirname, "../../../web/messages", `${locale}.json`), "utf8")));

const MOBILE_ONLY_NAMESPACE = "mobile.";

describe("mobile messages", () => {
  const flatEs = flatten(es);
  const flatEn = flatten(en);

  it("has identical keys in es and en", () => {
    expect(Object.keys(flatEn).sort()).toEqual(Object.keys(flatEs).sort());
  });

  it.each([
    ["es", flatEs],
    ["en", flatEn],
  ])("reuses the web app's keys and wording (%s)", (locale, messages) => {
    const web = webMessages(locale);
    for (const [key, value] of Object.entries(messages)) {
      if (key.startsWith(MOBILE_ONLY_NAMESPACE)) continue;
      expect({ key, value }).toEqual({ key, value: web[key] });
    }
  });
});
