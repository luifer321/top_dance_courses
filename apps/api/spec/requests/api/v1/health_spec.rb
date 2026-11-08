require "swagger_helper"

RSpec.describe "API v1 health", type: :request do
  path "/api/v1/health" do
    get "Readiness check" do
      tags "System"
      operationId "getHealth"
      produces "application/json"

      response "200", "application and database are available" do
        schema "$ref" => "#/components/schemas/Health"

        run_test! do |response|
          expect(response.parsed_body).to eq("status" => "ok", "database" => "ok")
        end
      end
    end
  end

  it "reports 503 when the database is unreachable" do
    allow(ActiveRecord::Base.connection).to receive(:select_value).and_raise(ActiveRecord::ConnectionNotEstablished)

    get "/api/v1/health"

    expect(response).to have_http_status(:service_unavailable)
    expect(response.parsed_body).to eq("status" => "degraded", "database" => "unavailable")
  end
end
