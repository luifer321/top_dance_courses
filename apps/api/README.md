# @top-dance/api

Rails 8.1 application (full Rails, not API-only) serving:

- REST API under `/api/v1` (JSON, localized errors, OpenAPI via rswag)
- ActiveAdmin at `/admin` (Devise `AdminUser`, Spanish/English)
- Solid Queue jobs (`bin/jobs`), Solid Cache, Solid Cable

```bash
cp .env.example .env
bin/rails db:prepare && bin/rails db:seed   # dev admin user
bin/rails server -p 3001                    # or: pnpm dev:api from the repo root
bundle exec rspec
bin/rubocop
bin/brakeman -q && bin/bundler-audit
RAILS_ENV=test bin/rails rswag:specs:swaggerize   # regenerate swagger/v1/openapi.yaml
```

## Layout

- `app/controllers/api/v1` — API controllers (`BaseController`: locale, errors, Pundit)
- `app/admin` — ActiveAdmin resources
- `app/policies` — Pundit policies
- `app/services`, `app/queries`, `app/serializers` — reserved for business logic
- `spec/requests/api/v1` — rswag specs (they also produce the OpenAPI document)

`config/master.key` is not committed. Keep it in a password manager and set
`RAILS_MASTER_KEY` in production.
