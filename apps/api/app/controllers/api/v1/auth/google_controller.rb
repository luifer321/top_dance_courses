# frozen_string_literal: true

module Api
  module V1
    module Auth
      class GoogleController < BaseController
        rate_limit to: 10, within: 15.minutes, only: :create, by: -> { request.remote_ip }, with: -> { rate_limited }

        def create
          user = ::Auth::GoogleAuthenticator.call(id_token: params.require(:id_token), locale: request_locale)
          issue_session!(user)
        rescue ::Auth::GoogleUnavailable
          render_error(:unprocessable_content, :google_unavailable)
        rescue ::Auth::InvalidGoogleToken, ::Auth::UnverifiedGoogleEmail
          render_unauthorized
        rescue ::Auth::GoogleAccountConflict
          render_error(:unprocessable_content, :google_conflict)
        end
      end
    end
  end
end
