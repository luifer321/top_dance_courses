# frozen_string_literal: true

module Api
  module V1
    module Webhooks
      class BunnyController < ActionController::API
        def create
          return head :unauthorized unless valid_token?

          guid = params[:VideoGuid].presence || params[:videoGuid]
          return head :bad_request if guid.blank?

          status = Bunny::VideoStatus.from_webhook_status(params[:Status].presence || params[:status])
          VideoAsset.where(provider: "bunny", provider_video_id: guid).find_each do |asset|
            asset.update_column(:status, status)
          end

          head :ok
        end

        private

        def valid_token?
          expected = Bunny.webhook_token
          given = params[:token].to_s
          return false if expected.blank? || given.blank?

          ActiveSupport::SecurityUtils.secure_compare(
            ::Digest::SHA256.hexdigest(given),
            ::Digest::SHA256.hexdigest(expected)
          )
        end
      end
    end
  end
end
