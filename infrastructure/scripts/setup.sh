#!/usr/bin/env bash
# One-time local setup: checks prerequisites, installs JS and Ruby dependencies,
# copies .env examples and prepares the development and test databases.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

fail() { echo "✗ $1" >&2; exit 1; }
ok() { echo "✓ $1"; }

echo "==> Checking prerequisites"

command -v node >/dev/null || fail "Node.js not found (need $(cat .nvmrc)+; try 'nvm use')"
node_major="$(node -p 'process.versions.node.split(".")[0]')"
[ "$node_major" -ge "$(cat .nvmrc)" ] || fail "Node $(node -v) found, need $(cat .nvmrc)+"
ok "Node $(node -v)"

command -v pnpm >/dev/null || fail "pnpm not found (run 'corepack enable' or 'brew install pnpm')"
ok "pnpm $(pnpm -v)"

command -v ruby >/dev/null || fail "Ruby not found (need $(cat .ruby-version), e.g. 'rbenv install')"
ruby_version="$(ruby -e 'print RUBY_VERSION')"
[ "$ruby_version" = "$(cat .ruby-version)" ] || fail "Ruby $ruby_version found, need $(cat .ruby-version) (rbenv/mise reads .ruby-version)"
ok "Ruby $ruby_version"

command -v bundle >/dev/null || fail "Bundler not found ('gem install bundler')"
ok "Bundler $(bundle -v | awk '{print $3}')"

if command -v pg_isready >/dev/null; then
  pg_isready -q -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" \
    || fail "PostgreSQL is not accepting connections on ${DB_HOST:-localhost}:${DB_PORT:-5432}"
  ok "PostgreSQL reachable"
else
  echo "! pg_isready not found; assuming PostgreSQL is running on ${DB_HOST:-localhost}:${DB_PORT:-5432}"
fi

echo "==> Environment files"
for app in api web mobile; do
  example="apps/$app/.env.example"
  target="apps/$app/.env"
  [ "$app" = "api" ] || target="apps/$app/.env.local"
  if [ -f "$example" ] && [ ! -f "$target" ]; then
    cp "$example" "$target"
    ok "Created $target"
  fi
done

echo "==> Installing JavaScript dependencies"
pnpm install

echo "==> Installing Ruby gems"
(cd apps/api && bundle install)

echo "==> Preparing databases"
(cd apps/api && bin/rails db:prepare && RAILS_ENV=test bin/rails db:prepare)

echo "==> Building shared packages"
pnpm --filter @top-dance/api-client build

cat <<'EOF'

Done. Next steps:
  pnpm dev           # web on http://localhost:3000, API on http://localhost:3001
  pnpm dev:mobile    # Expo (press i / a for a simulator)
  Admin:             http://localhost:3001/admin (see apps/api/db/seeds.rb for the dev login)
EOF
