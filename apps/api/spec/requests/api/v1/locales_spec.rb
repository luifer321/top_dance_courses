require "swagger_helper"

RSpec.describe "API v1 locales", type: :request do
  path "/api/v1/locales" do
    get "Supported interface languages" do
      tags "System"
      operationId "listLocales"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/locale"

      response "200", "supported locales, Spanish first and default" do
        schema "$ref" => "#/components/schemas/LocaleList"

        run_test! do |response|
          body = response.parsed_body
          expect(body["default_locale"]).to eq("es")
          expect(body["locales"]).to eq([
            { "code" => "es", "name" => "Español" },
            { "code" => "en", "name" => "English" }
          ])
        end
      end
    end
  end

  describe "Content-Language" do
    it "defaults to Spanish" do
      get "/api/v1/locales"
      expect(response.headers["Content-Language"]).to eq("es")
    end

    it "follows Accept-Language" do
      get "/api/v1/locales", headers: { "Accept-Language" => "en-US,en;q=0.9,es;q=0.8" }
      expect(response.headers["Content-Language"]).to eq("en")
    end

    it "prefers the locale param and ignores unsupported values" do
      get "/api/v1/locales", params: { locale: "en" }, headers: { "Accept-Language" => "es" }
      expect(response.headers["Content-Language"]).to eq("en")

      get "/api/v1/locales", params: { locale: "fr" }
      expect(response.headers["Content-Language"]).to eq("es")
    end
  end
end
