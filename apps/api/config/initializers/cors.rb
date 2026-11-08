# Cross-origin access to the JSON API only (/api/*). The admin dashboard is
# same-origin and is never exposed cross-origin.
#
# CORS_ORIGINS is a comma-separated allowlist of exact origins, e.g.
# "https://topdance.academy,https://www.topdance.academy". Wildcards are not
# allowed because credentials (cookies) are enabled for the web app.
allowed_origins = ENV.fetch("CORS_ORIGINS") {
  Rails.env.production? ? "" : "http://localhost:3000,http://localhost:8081"
}.split(",").map(&:strip).reject(&:empty?)

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*allowed_origins)

    resource "/api/*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      expose: %w[Content-Language],
      max_age: 600
  end
end
