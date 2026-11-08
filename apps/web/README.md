# @top-dance/web

Next.js App Router site, exported as static files for Cloudflare Pages.

```bash
pnpm --filter @top-dance/web dev        # http://localhost:3000
pnpm --filter @top-dance/web build      # static export to out/ (+ _redirects, 404s)
pnpm --filter @top-dance/web preview    # serve out/ locally
pnpm --filter @top-dance/web lint | typecheck | test
```

Environment: copy `.env.example` to `.env.local`.

## Layout

- `src/app/[locale]/…` — route files only. Spanish and English paths are separate
  folders (`cursos` / `courses`) that re-export the same page from `src/features`.
- `src/features/*` — page components per area (courses, lessons, auth, dashboard…).
- `src/components/ui` — shadcn/ui components (`pnpm dlx shadcn@latest add <name>`).
- `src/i18n` — next-intl routing, navigation and request config.
- `messages/{es,en}.json` — all UI text.
- `scripts/post-export.mjs` — localized 404 pages and Cloudflare `_redirects`.

Static export constraints: no middleware, Route Handlers with dynamic data, Server
Actions, `cookies()`/`headers()` or image optimization. Data comes from the Rails API
in the browser (`src/lib/api.ts`, TanStack Query).

See [`AGENTS.md`](AGENTS.md), [`docs/architecture/i18n.md`](../../docs/architecture/i18n.md)
and [`docs/design-system`](../../docs/design-system/README.md).
