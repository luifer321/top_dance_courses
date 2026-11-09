require "rails_helper"

# OpenAPI source of truth. Request specs under spec/requests/api tagged with
# rswag DSL generate swagger/v1/openapi.yaml via:
#   bin/rails rswag:specs:swaggerize
# The shared TypeScript client (packages/api-client) is generated from it.
RSpec.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s
  config.openapi_format = :yaml
  config.openapi_strict_schema_validation = true

  config.openapi_specs = {
    "v1/openapi.yaml" => {
      openapi: "3.0.3",
      info: {
        title: "Top Dance Academy API",
        version: "v1",
        description: "REST API shared by the Top Dance web and mobile apps."
      },
      servers: [
        { url: "http://localhost:3001", description: "Local development" }
      ],
      paths: {},
      components: {
        parameters: {
          locale: {
            name: :locale,
            in: :query,
            required: false,
            description: "Interface language for messages (overrides Accept-Language).",
            schema: { "$ref" => "#/components/schemas/LocaleCode" }
          },
          authTransport: {
            name: "X-Auth-Transport",
            in: :header,
            required: false,
            description: "cookie for the website session, token for mobile bearer tokens.",
            schema: { type: :string, enum: %w[cookie token] }
          },
          csrfToken: {
            name: "X-CSRF-Token",
            in: :header,
            required: false,
            description: "Required for state-changing cookie-authenticated requests.",
            schema: { type: :string }
          }
        },
        schemas: {
          LocaleCode: { type: :string, enum: %w[es en] },
          Error: {
            type: :object,
            required: %w[error],
            additionalProperties: false,
            properties: {
              error: {
                type: :object,
                required: %w[code message],
                additionalProperties: false,
                properties: {
                  code: { type: :string },
                  message: { type: :string }
                }
              }
            }
          },
          Health: {
            type: :object,
            required: %w[status database],
            additionalProperties: false,
            properties: {
              status: { type: :string, enum: %w[ok degraded] },
              database: { type: :string, enum: %w[ok unavailable] }
            }
          },
          Locale: {
            type: :object,
            required: %w[code name],
            additionalProperties: false,
            properties: {
              code: { "$ref" => "#/components/schemas/LocaleCode" },
              name: { type: :string, description: "Native language name." }
            }
          },
          LocaleList: {
            type: :object,
            required: %w[default_locale locales],
            additionalProperties: false,
            properties: {
              default_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              locales: { type: :array, items: { "$ref" => "#/components/schemas/Locale" } }
            }
          },
          User: {
            type: :object,
            required: %w[id name email preferred_locale],
            additionalProperties: false,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              email: { type: :string, format: :email },
              preferred_locale: { "$ref" => "#/components/schemas/LocaleCode" }
            }
          },
          UserSession: {
            type: :object,
            required: %w[user],
            additionalProperties: false,
            properties: {
              user: { "$ref" => "#/components/schemas/User" }
            }
          },
          AuthSession: {
            type: :object,
            required: %w[user access_token refresh_token expires_in],
            additionalProperties: false,
            properties: {
              user: { "$ref" => "#/components/schemas/User" },
              access_token: { type: :string },
              refresh_token: { type: :string },
              expires_in: { type: :integer }
            }
          },
          CsrfToken: {
            type: :object,
            required: %w[csrf_token],
            additionalProperties: false,
            properties: {
              csrf_token: { type: :string }
            }
          },
          Ok: {
            type: :object,
            required: %w[ok],
            additionalProperties: false,
            properties: {
              ok: { type: :boolean }
            }
          }
        }
      }
    }
  }
end
