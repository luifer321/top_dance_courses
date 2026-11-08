require "rails_helper"

RSpec.describe "API v1 error handling", type: :request do
  # A throwaway controller exercising BaseController's rescue handlers.
  before do
    stub_const("Api::V1::ProbeController", Class.new(Api::V1::BaseController) do
      def not_found = raise(ActiveRecord::RecordNotFound)
      def forbidden = raise(Pundit::NotAuthorizedError)
      def bad_request = params.require(:missing)
    end)

    Rails.application.routes.draw do
      namespace :api, defaults: { format: :json } do
        namespace :v1 do
          get "probe/:action", controller: "probe"
        end
      end
    end
  end

  after { Rails.application.reload_routes! }

  it "renders localized JSON errors" do
    get "/api/v1/probe/not_found"
    expect(response).to have_http_status(:not_found)
    expect(response.parsed_body).to eq("error" => { "code" => "not_found", "message" => "No se encontró el recurso solicitado." })

    get "/api/v1/probe/forbidden", headers: { "Accept-Language" => "en" }
    expect(response).to have_http_status(:forbidden)
    expect(response.parsed_body.dig("error", "message")).to eq("You are not allowed to perform this action.")

    get "/api/v1/probe/bad_request"
    expect(response).to have_http_status(:bad_request)
    expect(response.parsed_body.dig("error", "code")).to eq("bad_request")
  end
end
