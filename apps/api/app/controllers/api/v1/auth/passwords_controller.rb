# frozen_string_literal: true

module Api
  module V1
    module Auth
      class PasswordsController < BaseController
        rate_limit to: 5, within: 15.minutes, only: %i[create update], by: -> { request.remote_ip }, with: -> { rate_limited }

        def create
          ::Auth::PasswordReset.request!(email: params[:email], locale: request_locale)
          render json: { ok: true }
        end

        def update
          user = ::Auth::PasswordReset.reset!(token: params[:token], password: params[:password])
          if user
            render json: { ok: true }
          else
            render_error(:unprocessable_content, :unprocessable)
          end
        end
      end
    end
  end
end
