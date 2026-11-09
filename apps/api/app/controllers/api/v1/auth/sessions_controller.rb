# frozen_string_literal: true

module Api
  module V1
    module Auth
      class SessionsController < BaseController
        rate_limit to: 10, within: 15.minutes, only: :create, by: -> { request.remote_ip }, with: -> { rate_limited }

        def create
          user = authenticate_with_password
          if user
            issue_session!(user)
          else
            render_unauthorized
          end
        end

        def destroy
          RefreshToken.revoke_presented!(params[:refresh_token]) if token_auth?
          if cookie_auth?
            reset_session
          end
          render json: { ok: true }
        end

        private

        def authenticate_with_password
          email = params[:email].to_s.downcase.strip
          password = params[:password].to_s
          user = User.find_by(email: email)
          return user if user&.has_password? && user.valid_password?(password)

          nil
        end

        def cookie_auth?
          !token_auth?
        end
      end
    end
  end
end
