require "rails_helper"

RSpec.describe "CORS", type: :request do
  it "allows the configured web origin with credentials on the API" do
    get "/api/v1/health", headers: { "Origin" => "http://localhost:3000" }

    expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:3000")
    expect(response.headers["Access-Control-Allow-Credentials"]).to eq("true")
  end

  it "answers preflight requests from allowed origins" do
    options "/api/v1/health", headers: {
      "Origin" => "http://localhost:3000",
      "Access-Control-Request-Method" => "POST",
      "Access-Control-Request-Headers" => "Content-Type"
    }

    expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:3000")
    expect(response.headers["Access-Control-Allow-Methods"]).to include("POST")
  end

  it "rejects unknown origins" do
    get "/api/v1/health", headers: { "Origin" => "https://evil.example" }

    expect(response.headers["Access-Control-Allow-Origin"]).to be_nil
  end

  it "never exposes the admin dashboard cross-origin" do
    get "/admin/login", headers: { "Origin" => "http://localhost:3000" }

    expect(response.headers["Access-Control-Allow-Origin"]).to be_nil
  end
end
