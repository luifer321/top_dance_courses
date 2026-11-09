# frozen_string_literal: true

module Api
  module V1
    module Auth
      class RegistrationsController < BaseController
        rate_limit to: 10, within: 15.minutes, only: :create, by: -> { request.remote_ip }, with: -> { rate_limited }

        def create
          user = User.new(registration_params)
          user.preferred_locale = request_locale.to_s
          if user.save
            issue_session!(user, status: :created)
          else
            render_unprocessable(user)
          end
        end

        private

        def registration_params
          params.permit(:name, :email, :password)
        end
      end
    end
  end
end
