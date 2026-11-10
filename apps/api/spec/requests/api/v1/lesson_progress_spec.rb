# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "API v1 lesson progress", type: :request do
  path "/api/v1/courses/{slug}/lessons/{lesson_slug}/progress" do
    parameter name: :slug, in: :path, type: :string, required: true
    parameter name: :lesson_slug, in: :path, type: :string, required: true

    post "Record how far a student has watched a lesson" do
      tags "Courses"
      operationId "recordLessonProgress"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter name: :Authorization, in: :header, type: :string, required: false
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[position_seconds],
        properties: {
          position_seconds: { type: :integer },
          duration_seconds: { type: :integer },
          ended: { type: :boolean }
        }
      }

      response "200", "progress saved" do
        schema "$ref" => "#/components/schemas/LessonProgressResult"
        let!(:course) { create_published_catalog_course }
        let(:user) { create(:user) }
        let(:tokens) { Auth::TokenIssuer.issue!(user) }
        let(:"X-Auth-Transport") { "token" }
        let(:Authorization) { "Bearer #{tokens[:access_token]}" }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "paso-basico" }
        let(:body) { { position_seconds: 20, duration_seconds: 180, ended: false } }

        run_test! do |response|
          json = response.parsed_body["progress"]
          expect(json["position_seconds"]).to eq(20)
          expect(json["completed"]).to be(false)
        end
      end

      response "401", "signed out" do
        schema "$ref" => "#/components/schemas/Error"
        let!(:course) { create_published_catalog_course }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "paso-basico" }
        let(:body) { { position_seconds: 20 } }
        run_test!
      end
    end
  end

  it "marks a lesson complete once most of it has been watched" do
    course = create_published_catalog_course
    user = create(:user)
    tokens = Auth::TokenIssuer.issue!(user)

    post "/api/v1/courses/salsa-basics/lessons/paso-basico/progress",
      params: { position_seconds: 170, duration_seconds: 180 },
      headers: { "X-Auth-Transport" => "token", "Authorization" => "Bearer #{tokens[:access_token]}" },
      as: :json

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body.dig("progress", "completed")).to be(true)

    get "/api/v1/courses", params: { locale: "es" },
      headers: { "X-Auth-Transport" => "token", "Authorization" => "Bearer #{tokens[:access_token]}" }

    item = response.parsed_body["courses"].find { |row| row["slug"] == course.slug }
    expect(item.dig("progress", "percent")).to eq(100)
    expect(item.dig("progress", "completed_lessons")).to eq(1)
  end
end
