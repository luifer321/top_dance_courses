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
          }
        }
      }
    }
  }
end
