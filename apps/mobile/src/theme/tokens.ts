// Official Top Dance palette. Values are identical to the web app's
// apps/web/src/app/globals.css (verified by src/theme/tokens.test.ts).
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

// Same semantic mapping as the web (shadcn/ui token names, camelCased).
export const colors = {
  background: palette["dark-bg"],
  foreground: palette["gray-100"],
  card: palette["dark-card"],
  cardForeground: palette["gray-100"],
  cardHover: palette["dark-card-hover"],
  popover: palette["purple-dark"],
  primary: palette["purple-brand"],
  primaryForeground: palette.white,
  secondary: palette["purple-mid"],
  secondaryForeground: palette["gray-100"],
  muted: palette["purple-dark"],
  mutedForeground: palette["gray-300"],
  accent: palette["dark-card-hover"],
  accentForeground: palette["purple-glow"],
  border: "rgba(139, 95, 207, 0.22)",
  ring: palette["purple-light"],
  heading: palette.white,
  destructive: "#f87171",
  success: "#4ade80",
  warning: "#fbbf24",
  info: palette["purple-bright"],
} as const;

export const radius = { sm: 7, md: 10, lg: 12, xl: 17, full: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: "700" },
  title: { fontSize: 24, lineHeight: 30, fontWeight: "700" },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: "600" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
} as const;
