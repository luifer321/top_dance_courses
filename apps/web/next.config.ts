import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Static export for Cloudflare Pages: no Node.js server at runtime, so
// cookies(), headers(), proxy/middleware, rewrites, redirects, Server Actions
// and Cache Components are unavailable. Security headers live in public/_headers.
const createConfig = (phase: string): NextConfig => ({
  output: "export",
  // "page.dev.tsx" routes (the design-system reference) exist only in
  // development or when explicitly enabled; they are absent from production builds.
  pageExtensions:
    phase === PHASE_DEVELOPMENT_SERVER || process.env.NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM === "true"
      ? ["dev.tsx", "tsx", "ts"]
      : ["tsx", "ts"],
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@top-dance/api-client"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
});

export default function nextConfig(phase: string) {
  return withNextIntl(createConfig(phase));
}
