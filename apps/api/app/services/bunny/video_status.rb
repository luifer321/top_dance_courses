# frozen_string_literal: true

module Bunny
  class VideoStatus
    FINISHED_STATUS = 4
    FAILED_STATUSES = [ 5, 6 ].freeze

    def self.fetch(video_id)
      new.fetch(video_id)
    end

    def self.from_webhook_status(code)
      case Integer(code, exception: false)
      when FINISHED_STATUS then "ready"
      when *FAILED_STATUSES then "failed"
      else "processing"
      end
    end

    def fetch(video_id)
      return "processing" unless Bunny.configured_for_api?

      response = Bunny::Client.get_video(video_id)
      return "processing" if response.nil?

      self.class.from_webhook_status(response["status"])
    rescue Bunny::Client::Error
      "processing"
    end
  end
end
