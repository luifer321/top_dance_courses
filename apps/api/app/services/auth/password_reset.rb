# frozen_string_literal: true

module Auth
  class PasswordReset
    def self.request!(email:, locale:)
      user = User.find_by(email: email.to_s.downcase.strip)
      return if user.nil?

      raw = user.send(:set_reset_password_token)
      url = reset_url(raw, locale: user.preferred_locale.presence || locale)
      Rails.logger.info("[auth] Password reset for #{user.email}: #{url}") unless Rails.env.production?
    end

    def self.reset!(token:, password:)
      user = User.reset_password_by_token(
        reset_password_token: token,
        password: password,
        password_confirmation: password
      )
      return user if user&.errors&.empty? && user.persisted?

      nil
    end

    def self.reset_url(token, locale:)
      origin = ENV.fetch("WEB_ORIGIN", "http://localhost:3000")
      path = locale.to_s == "en" ? "/en/reset-password" : "/es/restablecer-contrasena"
      "#{origin}#{path}?token=#{ERB::Util.url_encode(token)}"
    end
  end
end
