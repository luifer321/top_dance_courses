require "swagger_helper"

RSpec.describe "API v1 me", type: :request do
  path "/api/v1/me" do
    get "The signed-in student" do
      tags "Users"
      operationId "getMe"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter name: :Authorization, in: :header, type: :string, required: false

      response "200", "current user" do
        schema "$ref" => "#/components/schemas/User"
        let(:user) { create(:user) }
        let(:tokens) { Auth::TokenIssuer.issue!(user) }
        let(:"X-Auth-Transport") { "token" }
        let(:Authorization) { "Bearer #{tokens[:access_token]}" }

        run_test! do |response|
          expect(response.parsed_body["email"]).to eq(user.email)
        end
      end

      response "401", "signed out" do
        schema "$ref" => "#/components/schemas/Error"
        run_test!
      end
    end

    patch "Update the signed-in student" do
      tags "Users"
      operationId "updateMe"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter "$ref" => "#/components/parameters/csrfToken"
      parameter name: :Authorization, in: :header, type: :string, required: false
      parameter name: :body, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          preferred_locale: { "$ref" => "#/components/schemas/LocaleCode" }
        }
      }

      response "200", "updated" do
        schema "$ref" => "#/components/schemas/User"
        let(:user) { create(:user) }
        let(:tokens) { Auth::TokenIssuer.issue!(user) }
        let(:"X-Auth-Transport") { "token" }
        let(:Authorization) { "Bearer #{tokens[:access_token]}" }
        let(:body) { { name: "Ana Updated", preferred_locale: "en" } }

        run_test! do |response|
          expect(response.parsed_body["name"]).to eq("Ana Updated")
          expect(response.parsed_body["preferred_locale"]).to eq("en")
        end
      end

      response "401", "signed out" do
        schema "$ref" => "#/components/schemas/Error"
        let(:body) { { name: "Ana" } }
        run_test!
      end
    end
  end
end
