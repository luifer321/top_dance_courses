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
end
