# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RefreshController < BaseController
        rate_limit to: 20, within: 15.minutes, only: :create, by: -> { request.remote_ip }, with: -> { rate_limited }

        def create
          rotated = ::Auth::TokenIssuer.rotate!(params[:refresh_token])
          if rotated
            render json: ::Auth::SessionPayload.call(rotated[:user], rotated)
          else
            render_unauthorized
          end
        end
      end
    end
  end
end
