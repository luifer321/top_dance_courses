# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "API v1 lessons", type: :request do
  path "/api/v1/courses/{slug}/lessons/{lesson_slug}" do
    parameter name: :slug, in: :path, type: :string, required: true
    parameter name: :lesson_slug, in: :path, type: :string, required: true

    get "Published lesson" do
      tags "Courses"
      operationId "getLesson"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/locale"

      response "200", "lesson details" do
        schema "$ref" => "#/components/schemas/LessonDetail"
        let!(:course) { create_published_catalog_course }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "paso-basico" }
        let(:locale) { "es" }

        run_test! do |response|
          json = response.parsed_body["lesson"]
          expect(json["slug"]).to eq("paso-basico")
          expect(json["course_slug"]).to eq("salsa-basics")
          expect(json["previous_slug"]).to be_nil
          expect(json["next_slug"]).to be_nil
        end
      end

      response "404", "unpublished lesson" do
        schema "$ref" => "#/components/schemas/Error"
        let!(:course) { create_published_catalog_course }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "missing-lesson" }
        run_test!
      end
    end
  end

  it "resolves a published lesson translation slug and keeps the stable slug" do
    course = create_published_catalog_course
    course.translations.create!(
      locale: "en",
      title: "Basic salsa",
      description: "Learn the basic step.",
      status: "published",
      slug: "basic-salsa"
    )
    lesson = course.lessons.first
    lesson.translation_for("es").update!(slug: "paso-basico-es")
    lesson.translations.create!(
      locale: "en",
      title: "Basic step",
      description: "The first step.",
      status: "published",
      slug: "basic-step"
    )

    get "/api/v1/courses/salsa-basics/lessons/basic-step", params: { locale: "en" }
    english = response.parsed_body["lesson"]
    expect(english["slug"]).to eq("basic-step")
    expect(english["localized_lesson_slugs"]).to eq("es" => "paso-basico-es", "en" => "basic-step")

    get "/api/v1/courses/salsa-basics/lessons/paso-basico", params: { locale: "es" }
    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["lesson"]["slug"]).to eq("paso-basico-es")
  end
end
