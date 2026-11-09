require "swagger_helper"

RSpec.describe "API v1 auth", type: :request do
  path "/api/v1/auth/csrf" do
    get "CSRF token for cookie-authenticated requests" do
      tags "Auth"
      operationId "getCsrfToken"
      produces "application/json"

      response "200", "token for X-CSRF-Token" do
        schema "$ref" => "#/components/schemas/CsrfToken"
        run_test! do |response|
          expect(response.parsed_body["csrf_token"]).to be_present
        end
      end
    end
  end

  path "/api/v1/auth/register" do
    post "Create a student account" do
      tags "Auth"
      operationId "register"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter "$ref" => "#/components/parameters/csrfToken"
      parameter "$ref" => "#/components/parameters/locale"
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[name email password],
        properties: {
          name: { type: :string },
          email: { type: :string },
          password: { type: :string }
        }
      }

      response "201", "account created" do
        schema "$ref" => "#/components/schemas/AuthSession"
        let(:body) { { name: "Ana Bailarina", email: "ana@example.com", password: "a-secure-test-password" } }
        let(:"X-Auth-Transport") { "token" }

        run_test! do |response|
          json = response.parsed_body
          expect(json.dig("user", "email")).to eq("ana@example.com")
          expect(json["access_token"]).to be_present
          expect(json["refresh_token"]).to be_present
        end
      end

      response "422", "invalid attributes" do
        schema "$ref" => "#/components/schemas/Error"
        let(:body) { { name: "Ana", email: "not-an-email", password: "short" } }
        let(:"X-Auth-Transport") { "token" }
        run_test!
      end
    end
  end

  path "/api/v1/auth/login" do
    post "Sign in with email and password" do
      tags "Auth"
      operationId "login"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter "$ref" => "#/components/parameters/csrfToken"
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[email password],
        properties: {
          email: { type: :string },
          password: { type: :string }
        }
      }

      response "200", "signed in" do
        schema "$ref" => "#/components/schemas/AuthSession"
        let!(:user) { create(:user, email: "ana@example.com") }
        let(:body) { { email: "ana@example.com", password: "a-secure-test-password" } }
        let(:"X-Auth-Transport") { "token" }

        run_test! do |response|
          expect(response.parsed_body.dig("user", "email")).to eq("ana@example.com")
          expect(response.parsed_body["access_token"]).to be_present
        end
      end

      response "401", "unknown email or wrong password" do
        schema "$ref" => "#/components/schemas/Error"
        let(:body) { { email: "missing@example.com", password: "a-secure-test-password" } }
        run_test! do |response|
          expect(response.parsed_body.dig("error", "code")).to eq("unauthorized")
        end
      end
    end
  end

  path "/api/v1/auth/google" do
    post "Sign in with a Google ID token" do
      tags "Auth"
      operationId "googleAuth"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter "$ref" => "#/components/parameters/csrfToken"
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[id_token],
        properties: { id_token: { type: :string } }
      }

      response "200", "signed in with Google" do
        schema "$ref" => "#/components/schemas/AuthSession"
        let(:"X-Auth-Transport") { "token" }
        let(:body) { { id_token: "google-id-token" } }

        before do
          ENV["GOOGLE_OAUTH_CLIENT_IDS"] = "test-client.apps.googleusercontent.com"
          allow(Google::Auth::IDTokens).to receive(:verify_oidc).and_return(
            "sub" => "google-sub-1",
            "email" => "ana@gmail.com",
            "email_verified" => true,
            "name" => "Ana G"
          )
        end

        run_test! do |response|
          expect(response.parsed_body.dig("user", "email")).to eq("ana@gmail.com")
          expect(response.parsed_body["access_token"]).to be_present
        end
      end

      response "422", "Google sign-in is not configured" do
        schema "$ref" => "#/components/schemas/Error"
        let(:body) { { id_token: "google-id-token" } }
        before { ENV.delete("GOOGLE_OAUTH_CLIENT_IDS") }
        run_test! do |response|
          expect(response.parsed_body.dig("error", "code")).to eq("google_unavailable")
        end
      end
    end
  end

  path "/api/v1/auth/session" do
    delete "Sign out" do
      tags "Auth"
      operationId "logout"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter "$ref" => "#/components/parameters/csrfToken"
      parameter name: :body, in: :body, required: false, schema: {
        type: :object,
        properties: { refresh_token: { type: :string } }
      }

      response "200", "signed out" do
        schema "$ref" => "#/components/schemas/Ok"
        let(:"X-Auth-Transport") { "token" }
        let(:body) { {} }
        run_test!
      end
    end
  end

  path "/api/v1/auth/refresh" do
    post "Rotate a mobile refresh token" do
      tags "Auth"
      operationId "refreshSession"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[refresh_token],
        properties: { refresh_token: { type: :string } }
      }

      response "200", "new access and refresh tokens" do
        schema "$ref" => "#/components/schemas/AuthSession"
        let(:user) { create(:user) }
        let(:refresh) { Auth::TokenIssuer.issue!(user) }
        let(:body) { { refresh_token: refresh[:refresh_token] } }
        let(:"X-Auth-Transport") { "token" }

        run_test! do |response|
          expect(response.parsed_body["access_token"]).to be_present
          expect(response.parsed_body["refresh_token"]).not_to eq(refresh[:refresh_token])
        end
      end

      response "401", "invalid or reused refresh token" do
        schema "$ref" => "#/components/schemas/Error"
        let(:body) { { refresh_token: "not-a-token" } }
        let(:"X-Auth-Transport") { "token" }
        run_test!
      end
    end
  end

  path "/api/v1/auth/password" do
    post "Request a password reset" do
      tags "Auth"
      operationId "requestPasswordReset"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter "$ref" => "#/components/parameters/csrfToken"
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[email],
        properties: { email: { type: :string } }
      }

      response "200", "always succeeds" do
        schema "$ref" => "#/components/schemas/Ok"
        let(:body) { { email: "unknown@example.com" } }
        run_test!
      end
    end
  end

  path "/api/v1/auth/password/reset" do
    post "Set a new password from a reset token" do
      tags "Auth"
      operationId "resetPassword"
      consumes "application/json"
      produces "application/json"
      parameter "$ref" => "#/components/parameters/authTransport"
      parameter name: :body, in: :body, schema: {
        type: :object,
        required: %w[token password],
        properties: {
          token: { type: :string },
          password: { type: :string }
        }
      }

      response "200", "password updated" do
        schema "$ref" => "#/components/schemas/Ok"
        let(:user) { create(:user) }
        let(:token) { user.send(:set_reset_password_token) }
        let(:body) { { token: token, password: "brand-new-password" } }
        run_test!
      end

      response "422", "invalid token" do
        schema "$ref" => "#/components/schemas/Error"
        let(:body) { { token: "invalid", password: "brand-new-password" } }
        run_test!
      end
    end
  end

  it "uses the same error for an unknown email and a wrong password" do
    create(:user, email: "ana@example.com")

    post "/api/v1/auth/login", params: { email: "missing@example.com", password: "a-secure-test-password" }, as: :json
    unknown = response.parsed_body

    post "/api/v1/auth/login", params: { email: "ana@example.com", password: "definitely-wrong-password" }, as: :json
    wrong = response.parsed_body

    expect(unknown).to eq(wrong)
    expect(unknown.dig("error", "code")).to eq("unauthorized")
  end

  it "rejects cookie mutations without a CSRF token" do
    ActionController::Base.allow_forgery_protection = true
    Api::V1::BaseController.allow_forgery_protection = true

    user = create(:user, email: "ana@example.com")
    post "/api/v1/auth/login",
      params: { email: user.email, password: "a-secure-test-password" },
      headers: { "X-Auth-Transport" => "cookie" },
      as: :json

    expect(response).to have_http_status(:forbidden)
    expect(response.parsed_body.dig("error", "code")).to eq("forbidden")
  ensure
    ActionController::Base.allow_forgery_protection = false
    Api::V1::BaseController.allow_forgery_protection = false
  end

  it "restores a cookie session on GET /me" do
    user = create(:user, email: "ana@example.com")
    post "/api/v1/auth/login",
      params: { email: user.email, password: "a-secure-test-password" },
      headers: { "X-Auth-Transport" => "cookie" },
      as: :json
    expect(response).to have_http_status(:ok)

    get "/api/v1/me", headers: { "X-Auth-Transport" => "cookie" }
    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["email"]).to eq("ana@example.com")
  end

  it "revokes a refresh family after reuse" do
    user = create(:user)
    first = Auth::TokenIssuer.issue!(user)

    post "/api/v1/auth/refresh",
      params: { refresh_token: first[:refresh_token] },
      headers: { "X-Auth-Transport" => "token" },
      as: :json
    expect(response).to have_http_status(:ok)
    second = response.parsed_body["refresh_token"]

    post "/api/v1/auth/refresh",
      params: { refresh_token: first[:refresh_token] },
      headers: { "X-Auth-Transport" => "token" },
      as: :json
    expect(response).to have_http_status(:unauthorized)

    post "/api/v1/auth/refresh",
      params: { refresh_token: second },
      headers: { "X-Auth-Transport" => "token" },
      as: :json
    expect(response).to have_http_status(:unauthorized)
  end

  it "takes over an unverified password account through Google" do
    ENV["GOOGLE_OAUTH_CLIENT_IDS"] = "test-client.apps.googleusercontent.com"
    create(:user, email: "ana@gmail.com")
    allow(Google::Auth::IDTokens).to receive(:verify_oidc).and_return(
      "sub" => "google-sub-9",
      "email" => "ana@gmail.com",
      "email_verified" => true,
      "name" => "Ana G"
    )

    post "/api/v1/auth/google",
      params: { id_token: "google-id-token" },
      headers: { "X-Auth-Transport" => "token" },
      as: :json

    expect(response).to have_http_status(:ok)
    expect(User.find_by(email: "ana@gmail.com").has_password?).to be(false)
    ENV.delete("GOOGLE_OAUTH_CLIENT_IDS")
  end
end
