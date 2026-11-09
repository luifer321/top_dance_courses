# frozen_string_literal: true

require "net/http"

module Bunny
  class Client
    class Error < StandardError; end

    BASE_URI = URI("https://video.bunnycdn.com")

    def self.get_video(video_id)
      new.get_video(video_id)
    end

    def get_video(video_id)
      raise Error, "Bunny Stream is not configured" unless Bunny.configured_for_api?

      uri = URI("#{BASE_URI}/library/#{Bunny.library_id}/videos/#{video_id}")
      request = Net::HTTP::Get.new(uri)
      request["AccessKey"] = Bunny.api_key
      request["Accept"] = "application/json"

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(request) }
      raise Error, "Bunny Stream returned #{response.code}" unless response.is_a?(Net::HTTPSuccess)

      JSON.parse(response.body)
    end
  end
end
