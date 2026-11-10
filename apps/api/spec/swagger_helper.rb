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
          },
          AvailableLanguages: {
            type: :object,
            required: %w[text audio subtitles],
            additionalProperties: false,
            properties: {
              text: { type: :array, items: { "$ref" => "#/components/schemas/LocaleCode" } },
              audio: { type: :array, items: { "$ref" => "#/components/schemas/LocaleCode" } },
              subtitles: { type: :array, items: { "$ref" => "#/components/schemas/LocaleCode" } }
            }
          },
          CourseProgress: {
            type: :object,
            required: %w[completed_lessons lesson_count percent],
            additionalProperties: false,
            properties: {
              completed_lessons: { type: :integer },
              lesson_count: { type: :integer },
              percent: { type: :integer }
            }
          },
          CourseSummary: {
            type: :object,
            required: %w[slug localized_slugs category requested_locale content_locale title lesson_count available_languages progress],
            additionalProperties: false,
            properties: {
              slug: { type: :string },
              localized_slugs: { type: :object, additionalProperties: { type: :string } },
              level: { type: :string, nullable: true, enum: %w[beginner intermediate advanced] },
              category: { oneOf: [ { "$ref" => "#/components/schemas/CourseCategory" }, { type: :null } ] },
              requested_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              content_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              title: { type: :string },
              description: { type: :string, nullable: true },
              cover_image_url: { type: :string, nullable: true },
              lesson_count: { type: :integer },
              duration_seconds: { type: :integer, nullable: true },
              available_languages: { "$ref" => "#/components/schemas/AvailableLanguages" },
              progress: { oneOf: [ { "$ref" => "#/components/schemas/CourseProgress" }, { type: :null } ] }
            }
          },
          CourseCategory: {
            type: :object,
            required: %w[slug name],
            additionalProperties: false,
            properties: {
              slug: { type: :string },
              name: { type: :string }
            }
          },
          CourseLessonSummary: {
            type: :object,
            required: %w[slug title content_locale free_preview completed],
            additionalProperties: false,
            properties: {
              slug: { type: :string },
              title: { type: :string },
              subtitle: { type: :string, nullable: true },
              duration_seconds: { type: :integer, nullable: true },
              thumbnail_url: { type: :string, nullable: true },
              free_preview: { type: :boolean },
              content_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              completed: { type: :boolean }
            }
          },
          CourseModule: {
            type: :object,
            required: %w[position title content_locale lessons],
            additionalProperties: false,
            properties: {
              position: { type: :integer },
              title: { type: :string },
              content_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              lessons: { type: :array, items: { "$ref" => "#/components/schemas/CourseLessonSummary" } }
            }
          },
          Course: {
            type: :object,
            required: %w[slug localized_slugs category requested_locale content_locale title lesson_count available_languages progress modules],
            additionalProperties: false,
            properties: {
              slug: { type: :string },
              localized_slugs: { type: :object, additionalProperties: { type: :string } },
              level: { type: :string, nullable: true, enum: %w[beginner intermediate advanced] },
              category: { oneOf: [ { "$ref" => "#/components/schemas/CourseCategory" }, { type: :null } ] },
              requested_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              content_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              title: { type: :string },
              description: { type: :string, nullable: true },
              cover_image_url: { type: :string, nullable: true },
              lesson_count: { type: :integer },
              duration_seconds: { type: :integer, nullable: true },
              available_languages: { "$ref" => "#/components/schemas/AvailableLanguages" },
              progress: { oneOf: [ { "$ref" => "#/components/schemas/CourseProgress" }, { type: :null } ] },
              modules: { type: :array, items: { "$ref" => "#/components/schemas/CourseModule" } }
            }
          },
          CourseList: {
            type: :object,
            required: %w[courses],
            additionalProperties: false,
            properties: {
              courses: { type: :array, items: { "$ref" => "#/components/schemas/CourseSummary" } }
            }
          },
          CourseDetail: {
            type: :object,
            required: %w[course],
            additionalProperties: false,
            properties: {
              course: { "$ref" => "#/components/schemas/Course" }
            }
          },
          Lesson: {
            type: :object,
            required: %w[slug title content_locale free_preview completed course_slug localized_slugs localized_lesson_slugs requested_locale available_languages],
            additionalProperties: false,
            properties: {
              slug: { type: :string },
              title: { type: :string },
              subtitle: { type: :string, nullable: true },
              duration_seconds: { type: :integer, nullable: true },
              thumbnail_url: { type: :string, nullable: true },
              free_preview: { type: :boolean },
              content_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              completed: { type: :boolean },
              course_slug: { type: :string },
              localized_slugs: { type: :object, additionalProperties: { type: :string } },
              localized_lesson_slugs: { type: :object, additionalProperties: { type: :string } },
              description: { type: :string, nullable: true },
              requested_locale: { "$ref" => "#/components/schemas/LocaleCode" },
              available_languages: { "$ref" => "#/components/schemas/AvailableLanguages" },
              previous_slug: { type: :string, nullable: true },
              next_slug: { type: :string, nullable: true }
            }
          },
          LessonDetail: {
            type: :object,
            required: %w[lesson],
            additionalProperties: false,
            properties: {
              lesson: { "$ref" => "#/components/schemas/Lesson" }
            }
          },
          Playback: {
            type: :object,
            required: %w[embed_url expires_at],
            additionalProperties: false,
            properties: {
              embed_url: { type: :string, format: :uri },
              expires_at: { type: :string, format: :"date-time" }
            }
          },
          LessonProgress: {
            type: :object,
            required: %w[position_seconds completed],
            additionalProperties: false,
            properties: {
              position_seconds: { type: :integer },
              completed: { type: :boolean }
            }
          },
          LessonProgressResult: {
            type: :object,
            required: %w[progress],
            additionalProperties: false,
            properties: {
              progress: { "$ref" => "#/components/schemas/LessonProgress" }
            }
          }
        }
      }
    }
  }
end
