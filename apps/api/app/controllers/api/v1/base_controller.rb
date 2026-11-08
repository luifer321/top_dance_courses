module Api
  module V1
    # Base for every /api/v1 endpoint.
    #
    # Authentication is not implemented yet. When it is, web requests will use
    # the Rails session cookie (+ CSRF token) and mobile requests a bearer
    # token; both resolve to the same User and the same Pundit policies.
    # See docs/architecture/authentication.md.
    class BaseController < ActionController::API
      include Pundit::Authorization

      around_action :with_request_locale

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
      rescue_from ActionController::ParameterMissing, with: :render_bad_request
      rescue_from Pundit::NotAuthorizedError, with: :render_forbidden

      private

      # Interface language for messages in the response. Precedence:
      # ?locale= param, then Accept-Language, then the default (es).
      # This never changes which course content language is returned.
      def with_request_locale(&)
        response.headers["Content-Language"] = request_locale.to_s
        I18n.with_locale(request_locale, &)
      end

      def request_locale
        @request_locale ||= LocaleResolver.call(param: params[:locale], accept_language: request.headers["Accept-Language"])
      end

      # rescue_from handlers run after the around_action has unwound, so the
      # locale is passed explicitly.
      def render_error(status, code)
        message = I18n.t("api.errors.#{code}", locale: request_locale)
        render json: { error: { code: code.to_s, message: message } }, status: status
      end

      def render_not_found(_error = nil) = render_error(:not_found, :not_found)
      def render_bad_request(_error = nil) = render_error(:bad_request, :bad_request)
      def render_forbidden(_error = nil) = render_error(:forbidden, :forbidden)
    end
  end
end
