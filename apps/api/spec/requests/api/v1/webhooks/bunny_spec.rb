# frozen_string_literal: true

require "rails_helper"

RSpec.describe "API v1 Bunny webhook", type: :request do
  let!(:course) { create_published_catalog_course(video_status: "processing") }
  let(:asset) { VideoAsset.last }

  it "updates the matching video asset status" do
    allow(Bunny).to receive(:webhook_token).and_return("secret-token")

    post "/api/v1/webhooks/bunny", params: { token: "secret-token", VideoGuid: asset.provider_video_id, Status: 4 }

    expect(response).to have_http_status(:ok)
    expect(asset.reload.status).to eq("ready")
  end

  it "rejects a missing or invalid token" do
    allow(Bunny).to receive(:webhook_token).and_return("secret-token")

    post "/api/v1/webhooks/bunny", params: { token: "wrong", VideoGuid: asset.provider_video_id, Status: 4 }

    expect(response).to have_http_status(:unauthorized)
    expect(asset.reload.status).to eq("processing")
  end
end
