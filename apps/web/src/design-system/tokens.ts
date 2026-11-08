// Official Top Dance palette. Mirrors the :root variables in src/app/globals.css
// (kept in sync by src/design-system/tokens.test.ts).
export const palette = {
  "purple-darkest": "#0f0a1a",
  "purple-dark": "#1a1128",
  "purple-mid": "#2d1b4e",
  "purple-brand": "#6b3fa0",
  "purple-light": "#8b5fcf",
  "purple-bright": "#a87de8",
  "purple-glow": "#c4a1f0",
  white: "#ffffff",
  "gray-100": "#f0edf5",
  "gray-200": "#d4cfe0",
  "gray-300": "#a89fba",
  "gray-400": "#7a7190",
  "dark-bg": "#0a0612",
  "dark-card": "#15101f",
  "dark-card-hover": "#1e1530",
} as const;

export type PaletteToken = keyof typeof palette;

export const semanticTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
] as const;

export const statusTokens = ["success", "warning", "destructive", "info"] as const;
