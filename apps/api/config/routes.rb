Rails.application.routes.draw do
  # Administration dashboard (ActiveAdmin + Devise AdminUser) at /admin.
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # JSON API consumed by the Next.js web app and the Expo mobile app.
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get "health", to: "health#show"
      get "locales", to: "locales#index"
    end
  end

  # OpenAPI document (swagger/v1/openapi.yaml) and Swagger UI.
  if Rails.application.config.x.api_docs_enabled
    mount Rswag::Ui::Engine => "/api-docs"
    mount Rswag::Api::Engine => "/api-docs"
  end

  # Liveness probe for Railway and uptime monitors.
  get "up" => "rails/health#show", as: :rails_health_check

  root to: redirect("/admin")
end
