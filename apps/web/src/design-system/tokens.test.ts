import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { palette, semanticTokens, statusTokens } from "./tokens";

const css = readFileSync(join(__dirname, "..", "app", "globals.css"), "utf8");
const officialBlock = /:root\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";

describe("design tokens", () => {
  it("declares every official palette variable with its exact value", () => {
    for (const [name, value] of Object.entries(palette)) {
      expect(officialBlock, `--${name}`).toContain(`--${name}: ${value};`);
    }
  });

  it("declares nothing else in the official palette block", () => {
    const declared = [...officialBlock.matchAll(/--([\w-]+):/g)].map((m) => m[1]);
    expect(declared.sort()).toEqual(Object.keys(palette).sort());
  });

  it("maps every shadcn semantic and status token to a Tailwind color", () => {
    for (const token of [...semanticTokens, ...statusTokens]) {
      expect(css, token).toMatch(new RegExp(`--${token}:\\s*[^;]+;`));
      expect(css, token).toContain(`--color-${token}: var(--${token});`);
    }
  });
});
