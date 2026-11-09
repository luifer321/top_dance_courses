# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "API v1 courses", type: :request do
  path "/api/v1/courses" do
    get "Published course catalog" do
      tags "Courses"
      operationId "listCourses"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/locale"

      response "200", "published courses" do
        schema "$ref" => "#/components/schemas/CourseList"
        let!(:course) { create_published_catalog_course }
        let(:locale) { "en" }

        run_test! do |response|
          json = response.parsed_body
          expect(json["courses"].length).to eq(1)
          item = json["courses"].first
          expect(item["slug"]).to eq("salsa-basics")
          expect(item["title"]).to eq("Salsa básica")
          expect(item["requested_locale"]).to eq("en")
          expect(item["content_locale"]).to eq("es")
        end
      end
    end
  end

  path "/api/v1/courses/{slug}" do
    parameter name: :slug, in: :path, type: :string, required: true

    get "Published course" do
      tags "Courses"
      operationId "getCourse"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/locale"

      response "200", "course with modules and lessons" do
        schema "$ref" => "#/components/schemas/CourseDetail"
        let!(:course) { create_published_catalog_course }
        let(:slug) { "salsa-basics" }
        let(:locale) { "es" }

        run_test! do |response|
          json = response.parsed_body["course"]
          expect(json["title"]).to eq("Salsa básica")
          expect(json["modules"].first["lessons"].first["slug"]).to eq("paso-basico")
        end
      end

      response "404", "unknown or unpublished course" do
        schema "$ref" => "#/components/schemas/Error"
        let(:slug) { "missing-course" }
        run_test!
      end
    end
  end

  it "omits draft courses" do
    create(:course, slug: "draft-course")
    get "/api/v1/courses"
    expect(response.parsed_body["courses"]).to eq([])
  end
end
