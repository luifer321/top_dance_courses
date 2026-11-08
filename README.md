# Top Dance Academy

Bilingual (Spanish default, English) online dance academy: video courses in salsa,
bachata, technique, musicality and more.

This is a pnpm + Turborepo monorepo:

| Path | What | Stack |
| --- | --- | --- |
| `apps/web` | Website and student area | Next.js 16 (static export), Tailwind CSS 4, shadcn/ui, next-intl |
| `apps/api` | REST API (`/api/v1`) and admin (`/admin`) | Rails 8.1, PostgreSQL, ActiveAdmin, Devise, Pundit, Solid Queue |
| `apps/mobile` | iOS / Android app | Expo SDK 58, Expo Router, i18next |
| `packages/api-client` | Typed API client | openapi-typescript + openapi-fetch |
| `docs/` | Architecture, API and design-system docs | |
| `infrastructure/scripts/` | Setup and code-generation scripts | |

## Prerequisites

- Node.js 22+ (`.nvmrc`) and pnpm 11 (`corepack enable`)
- Ruby 3.4.12 (`.ruby-version`, e.g. via rbenv) and Bundler
- PostgreSQL 16+ on `localhost:5432` (Postgres.app, Homebrew or Docker)
- For mobile: Xcode (iOS simulator) and/or Android Studio, or the Expo Go app

## Setup

```bash
infrastructure/scripts/setup.sh
```

This checks the prerequisites, copies `.env.example` files, runs `pnpm install` and
`bundle install`, prepares the development and test databases, and builds the shared
package. To create a local admin user: `cd apps/api && bin/rails db:seed`
(credentials in `apps/api/.env.example`).

## Development

| Command | Runs |
| --- | --- |
| `pnpm dev` | Web (http://localhost:3000) and API (http://localhost:3001) |
| `pnpm dev:web` | Web only |
| `pnpm dev:api` | API only |
| `pnpm dev:mobile` | Expo dev server (Metro on :8081) |
| `pnpm api:generate` | Regenerate OpenAPI spec and TypeScript client |

Useful URLs:

- http://localhost:3000/es/ and http://localhost:3000/en/
- http://localhost:3000/es/design-system/ (development only)
- http://localhost:3001/admin (ActiveAdmin)
- http://localhost:3001/api-docs (OpenAPI UI)
- http://localhost:3001/api/v1/health

## Quality checks

```bash
pnpm lint        # ESLint (web, mobile), RuboCop (api)
pnpm typecheck   # tsc (web, mobile, api-client)
pnpm test        # Vitest (web, api-client), Jest (mobile), RSpec (api)
pnpm build       # web static export, api-client, mobile iOS/Android bundles
```

Per app: `pnpm --filter @top-dance/<web|api|mobile|api-client> <script>`. API security
scans: `pnpm --filter @top-dance/api security` (Brakeman + bundler-audit).

Ruby gems are managed only with Bundler in `apps/api`; the `package.json` there just
exposes Rails commands to Turborepo.

## Documentation

- [Architecture overview](docs/architecture/overview.md)
- [Internationalization](docs/architecture/i18n.md)
- [Authentication (design)](docs/architecture/authentication.md)
- [Course content model (proposal)](docs/architecture/content-model.md)
- [Integrations](docs/architecture/integrations.md)
- [API and generated client](docs/api/README.md)
- [Design system](docs/design-system/README.md)

## Deployment (summary)

- Web → Cloudflare Pages: build `pnpm --filter @top-dance/web build`, output `apps/web/out`.
- API → Railway: `apps/api/Dockerfile`, health check `/up`, `RAILS_MASTER_KEY` required.
- Mobile → EAS Build (not configured yet).

Details and required environment variables: [integrations](docs/architecture/integrations.md).
