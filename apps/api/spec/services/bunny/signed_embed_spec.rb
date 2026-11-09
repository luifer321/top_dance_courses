# frozen_string_literal: true

require "rails_helper"

RSpec.describe Bunny::SignedEmbed do
  it "builds a SHA256 embed URL" do
    allow(Bunny).to receive_messages(
      configured_for_signing?: true,
      library_id: "99",
      token_auth_key: "secret"
    )
    expires_at = Time.zone.at(1_700_000_000)
    payload = described_class.call("video-guid", expires_at: expires_at)
    token = Digest::SHA256.hexdigest("secretvideo-guid1700000000")

    expect(payload[:embed_url]).to eq("https://iframe.mediadelivery.net/embed/99/video-guid?token=#{token}&expires=1700000000")
    expect(payload[:expires_at]).to eq("2023-11-14T22:13:20Z")
  end
end
