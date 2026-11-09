Rails.application.routes.draw do
  # Administration dashboard (ActiveAdmin + Devise AdminUser) at /admin.
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  # Student Devise mapping only — no HTML routes. Sessions live at /api/v1/auth.
  devise_for :users, skip: :all

  # JSON API consumed by the Next.js web app and the Expo mobile app.
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      get "health", to: "health#show"
      get "locales", to: "locales#index"

      namespace :auth do
        get "csrf", to: "csrf#show"
        post "register", to: "registrations#create"
        post "login", to: "sessions#create"
        post "google", to: "google#create"
        delete "session", to: "sessions#destroy"
        post "refresh", to: "refresh#create"
        post "password", to: "passwords#create"
        post "password/reset", to: "passwords#update"
      end

      resource :me, only: %i[show update], controller: "me"

      resources :courses, param: :slug, only: %i[index show] do
        resources :lessons, param: :lesson_slug, only: :show
      end
      get "courses/:course_slug/lessons/:lesson_slug/playback",
          to: "lesson_playbacks#show",
          as: :course_lesson_playback

      namespace :webhooks do
        post "bunny", to: "bunny#create"
      end
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
