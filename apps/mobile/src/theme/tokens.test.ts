import { readFileSync } from "node:fs";
import { join } from "node:path";

import { palette } from "./tokens";

describe("theme tokens", () => {
  it("matches the official palette declared by the web app", () => {
    const css = readFileSync(join(__dirname, "../../../web/src/app/globals.css"), "utf8");
    const officialBlock = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
    const webPalette = Object.fromEntries(
      [...officialBlock.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((m) => [m[1], m[2]]),
    );

    expect(palette).toEqual(webPalette);
  });
});
