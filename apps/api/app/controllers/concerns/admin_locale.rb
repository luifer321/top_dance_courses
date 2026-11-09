# Admin interface language. Staff switch with ?locale=es|en; the choice is
# kept in the session. This only affects the admin UI, never content.
module AdminLocale
  extend ActiveSupport::Concern

  included do
    around_action :with_admin_locale
  end

  private

  def with_admin_locale(&)
    requested = params[:locale].to_s
    session[:admin_locale] = requested if I18n.available_locales.map(&:to_s).include?(requested)
    locale = LocaleResolver.call(param: session[:admin_locale], accept_language: request.headers["Accept-Language"])
    I18n.with_locale(locale, &)
  end
end
