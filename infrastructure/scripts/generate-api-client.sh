#!/usr/bin/env bash
# Regenerates the OpenAPI spec from the Rails rswag request specs, then the
# TypeScript types in packages/api-client. Requires PostgreSQL (test database).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "==> Generating apps/api/swagger/v1/openapi.yaml"
(cd "$ROOT/apps/api" && RAILS_ENV=test bin/rails db:prepare >/dev/null && RAILS_ENV=test bin/rails rswag:specs:swaggerize)

echo "==> Generating packages/api-client/src/generated/schema.ts"
pnpm --dir "$ROOT" --filter @top-dance/api-client generate

echo "==> Building @top-dance/api-client"
pnpm --dir "$ROOT" --filter @top-dance/api-client build
