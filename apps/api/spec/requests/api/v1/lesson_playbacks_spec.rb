# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "API v1 lesson playback", type: :request do
  path "/api/v1/courses/{slug}/lessons/{lesson_slug}/playback" do
    parameter name: :slug, in: :path, type: :string, required: true
    parameter name: :lesson_slug, in: :path, type: :string, required: true

    get "Signed Bunny embed URL" do
      tags "Courses"
      operationId "getLessonPlayback"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter name: :Authorization, in: :header, type: :string, required: false

      response "200", "signed embed" do
        schema "$ref" => "#/components/schemas/Playback"
        let!(:course) { create_published_catalog_course }
        let(:user) { create(:user) }
        let(:tokens) { Auth::TokenIssuer.issue!(user) }
        let(:"X-Auth-Transport") { "token" }
        let(:Authorization) { "Bearer #{tokens[:access_token]}" }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "paso-basico" }

        before do
          allow(Bunny).to receive_messages(
            configured_for_signing?: true,
            library_id: "12345",
            token_auth_key: "test-token-key"
          )
        end

        run_test! do |response|
          json = response.parsed_body
          expect(json["embed_url"]).to start_with("https://iframe.mediadelivery.net/embed/12345/")
          expect(json["expires_at"]).to be_present
        end
      end

      response "401", "signed out" do
        schema "$ref" => "#/components/schemas/Error"
        let!(:course) { create_published_catalog_course }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "paso-basico" }
        run_test!
      end

      response "422", "playback not configured" do
        schema "$ref" => "#/components/schemas/Error"
        let!(:course) { create_published_catalog_course }
        let(:user) { create(:user) }
        let(:tokens) { Auth::TokenIssuer.issue!(user) }
        let(:"X-Auth-Transport") { "token" }
        let(:Authorization) { "Bearer #{tokens[:access_token]}" }
        let(:slug) { "salsa-basics" }
        let(:lesson_slug) { "paso-basico" }

        run_test! do |response|
          expect(response.parsed_body.dig("error", "code")).to eq("playback_unavailable")
        end
      end
    end
  end
end
