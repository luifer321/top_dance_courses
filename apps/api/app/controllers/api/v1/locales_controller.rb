module Api
  module V1
    # Supported interface languages. Clients use this to stay aligned with the
    # backend's locale codes (ISO 639-1).
    class LocalesController < BaseController
      def index
        render json: {
          default_locale: I18n.default_locale.to_s,
          locales: I18n.available_locales.map { |code| { code: code.to_s, name: I18n.t("locales.#{code}", locale: code) } }
        }
      end
    end
  end
end
