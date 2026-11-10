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
        let(:locale) { "es" }

        run_test! do |response|
          json = response.parsed_body
          expect(json["courses"].length).to eq(1)
          item = json["courses"].first
          expect(item["slug"]).to eq("salsa-basics")
          expect(item["title"]).to eq("Salsa básica")
          expect(item["cover_image_url"]).to eq("/catalog/salsa-basics.svg")
          expect(item["lesson_count"]).to eq(1)
          expect(item["progress"]).to be_nil
          expect(item["requested_locale"]).to eq("es")
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
          lesson = json["modules"].first["lessons"].first
          expect(lesson["slug"]).to eq("paso-basico")
          expect(lesson["subtitle"]).to eq("Técnica, peso y ritmo del primer paso.")
          expect(lesson["thumbnail_url"]).to eq("/catalog/paso-basico.svg")
          expect(lesson["completed"]).to be(false)
          expect(json["progress"]).to be_nil
        end
      end

      response "404", "unknown or unpublished course" do
        schema "$ref" => "#/components/schemas/Error"
        let(:slug) { "missing-course" }
        run_test!
      end
    end
  end

  it "serves an uploaded cover instead of the url" do
    course = create_published_catalog_course
    course.cover_image.attach(io: StringIO.new("cover"), filename: "cover.jpg", content_type: "image/jpeg")

    get "/api/v1/courses", params: { locale: "es" }

    url = response.parsed_body["courses"].first["cover_image_url"]
    expect(url).to include("/rails/active_storage/")
    expect(url).to start_with("http://example.com")
  end

  it "omits draft courses" do
    create(:course, slug: "draft-course")
    get "/api/v1/courses"
    expect(response.parsed_body["courses"]).to eq([])
  end

  it "omits a course that is not published in the requested language" do
    create_published_catalog_course

    get "/api/v1/courses", params: { locale: "en" }
    expect(response.parsed_body["courses"]).to eq([])

    get "/api/v1/courses/salsa-basics", params: { locale: "en" }
    expect(response).to have_http_status(:not_found)

    get "/api/v1/courses", params: { locale: "es" }
    expect(response.parsed_body["courses"].map { |item| item["slug"] }).to eq([ "salsa-basics" ])
  end

  it "resolves a published translation slug and omits languages that are not published" do
    course = create_published_catalog_course
    course.translation_for("es").update!(slug: "salsa-basica")
    course.translations.create!(
      locale: "en",
      title: "Basic salsa",
      description: "Learn the basic step.",
      status: "published",
      slug: "basic-salsa"
    )

    get "/api/v1/courses/salsa-basica", params: { locale: "es" }
    spanish = response.parsed_body["course"]
    expect(spanish["slug"]).to eq("salsa-basica")
    expect(spanish["localized_slugs"]).to eq("es" => "salsa-basica", "en" => "basic-salsa")

    get "/api/v1/courses/basic-salsa", params: { locale: "en" }
    english = response.parsed_body["course"]
    expect(english["title"]).to eq("Basic salsa")
    expect(english["content_locale"]).to eq("en")
    expect(english["slug"]).to eq("basic-salsa")

    get "/api/v1/courses/salsa-basics", params: { locale: "es" }
    expect(response.parsed_body["course"]["slug"]).to eq("salsa-basica")
  end
end
