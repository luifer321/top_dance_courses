# frozen_string_literal: true

# Student and admin sessions share this cookie. Scopes stay separate (User vs
# AdminUser). No Domain attribute: the cookie stays on the API host.
Rails.application.config.session_store :cookie_store,
  key: "_top_dance_session",
  httponly: true,
  same_site: :lax,
  secure: Rails.env.production?
