# API and generated client

The Rails API is versioned under `/api/v1` and returns JSON. The OpenAPI document is the
contract between the API and the TypeScript clients.

```
rswag request specs (apps/api/spec/requests/api/v1/*_spec.rb)
        │  RAILS_ENV=test bin/rails rswag:specs:swaggerize
        ▼
apps/api/swagger/v1/openapi.yaml           (committed)
        │  openapi-typescript
        ▼
packages/api-client/src/generated/schema.ts (committed)
        │  tsc
        ▼
@top-dance/api-client  →  apps/web, apps/mobile
```

## Endpoints today

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | Readiness: `{ status, database }`, 503 when the DB is down |
| GET | `/api/v1/locales` | Supported interface languages, Spanish default |
| GET | `/api/v1/auth/csrf` | CSRF token for cookie-authenticated requests |
| POST | `/api/v1/auth/register` | Create a student (`name`, `email`, `password`) |
| POST | `/api/v1/auth/login` | Email/password sign-in |
| POST | `/api/v1/auth/google` | Google ID token sign-in |
| DELETE | `/api/v1/auth/session` | Sign out (cookie or refresh token) |
| POST | `/api/v1/auth/refresh` | Rotate a mobile refresh token |
| POST | `/api/v1/auth/password` | Request a password reset |
| POST | `/api/v1/auth/password/reset` | Set a new password from a reset token |
| GET | `/api/v1/me` | Signed-in student |
| PATCH | `/api/v1/me` | Update `name` or `preferred_locale` |
| GET | `/up` | Rails liveness check (for Railway) |

Interactive docs: http://localhost:3001/api-docs (enabled outside production, or with
`API_DOCS_ENABLED=true`).

## Conventions

- Locale: `?locale=es|en` or `Accept-Language`; response has `Content-Language`.
- Errors: `{ "error": { "code": "not_found", "message": "<localized>" } }` with codes
  `bad_request`, `unauthorized`, `forbidden`, `not_found`, `unprocessable`, `internal`,
  `rate_limited`, `google_unavailable`, `google_conflict`.
- Web sends `X-Auth-Transport: cookie` and `X-CSRF-Token`. Mobile sends
  `X-Auth-Transport: token` and `Authorization: Bearer …`.
- Every endpoint gets an rswag spec with response schemas; `swagger_helper.rb` sets
  `openapi_strict_schema_validation`, so responses must match the documented schema.
- Give each operation an `operationId`.

## Regenerating

```bash
pnpm api:generate   # requires PostgreSQL running
```

This runs `infrastructure/scripts/generate-api-client.sh`: rswag → `openapi.yaml` →
`openapi-typescript` → `tsc` build. Commit both generated files. In CI, run it and fail
if `git diff --exit-code` reports changes.

## Using the client

```ts
import { createApiClient } from "@top-dance/api-client";

const api = createApiClient({
  baseUrl: "http://localhost:3001",
  getLocale: () => "es",            // sent as Accept-Language
  credentials: "include",           // web: session cookie
  // getAuthHeaders: async () => ({ Authorization: `Bearer ${token}` }), // mobile
});

const { data, error } = await api.GET("/api/v1/locales");
```

The client is built on `openapi-fetch` and only needs a global `fetch`, so it runs in
browsers and React Native. Preconfigured instances: `apps/web/src/lib/api.ts`,
`apps/mobile/src/lib/api.ts`.
