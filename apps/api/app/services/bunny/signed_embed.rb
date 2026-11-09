# frozen_string_literal: true

require "digest"

module Bunny
  class SignedEmbed
    class Error < StandardError; end

    TTL = 4.hours
    EMBED_HOST = "https://iframe.mediadelivery.net/embed"

    def self.call(video_id, expires_at: Time.current + TTL)
      new(video_id, expires_at).payload
    end

    def initialize(video_id, expires_at = Time.current + TTL)
      @video_id = video_id
      @expires_at = expires_at
    end

    def payload
      raise Error, "Bunny Stream signing is not configured" unless Bunny.configured_for_signing?

      expires = @expires_at.to_i
      token = Digest::SHA256.hexdigest("#{Bunny.token_auth_key}#{@video_id}#{expires}")
      {
        embed_url: "#{EMBED_HOST}/#{Bunny.library_id}/#{@video_id}?token=#{token}&expires=#{expires}",
        expires_at: Time.zone.at(expires).utc.iso8601
      }
    end
  end
end
