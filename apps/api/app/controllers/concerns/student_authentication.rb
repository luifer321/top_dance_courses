# frozen_string_literal: true

# Cookie sessions (website) and bearer tokens (mobile) resolve to the same User.
# Student id is stored in the encrypted session cookie so JSON cookie
# serialization never has to round-trip an ActiveRecord object.
module StudentAuthentication
  extend ActiveSupport::Concern

  SESSION_KEY = :student_id
  LAST_SEEN_KEY = :student_last_seen_at
  SESSION_TTL = 2.hours

  included do
    include ActionController::Cookies
    include ActionController::RequestForgeryProtection

    # ActionController::API does not inherit Base's test-env default.
    self.allow_forgery_protection = !Rails.env.test?

    protect_from_forgery with: :exception, unless: :token_auth?

    rescue_from ActionController::InvalidAuthenticityToken do
      render_error(:forbidden, :forbidden)
    end
  end

  private

  def current_student
    @current_student ||= token_auth? ? student_from_access_token : student_from_cookie
  end

  def authenticate_student!
    render_error(:unauthorized, :unauthorized) unless current_student
  end

  def pundit_user
    current_student
  end

  def token_auth?
    request.headers["X-Auth-Transport"].to_s == "token"
  end

  def student_from_access_token
    header = request.authorization.to_s
    return unless header.start_with?("Bearer ")

    Auth::AccessToken.decode(header.delete_prefix("Bearer ").strip)
  end

  def student_from_cookie
    id = session[SESSION_KEY]
    return if id.blank?
    return clear_student_session if session_expired?

    user = User.find_by(id: id)
    touch_student_session if user
    user
  end

  def session_expired?
    last_seen = session[LAST_SEEN_KEY]
    last_seen.present? && Time.zone.parse(last_seen.to_s) < SESSION_TTL.ago
  end

  def touch_student_session
    session[LAST_SEEN_KEY] = Time.current.iso8601
  end

  def write_student_session(user)
    reset_session
    session[SESSION_KEY] = user.id
    touch_student_session
  end

  def clear_student_session
    session.delete(SESSION_KEY)
    session.delete(LAST_SEEN_KEY)
    nil
  end

  def issue_session!(user, status: :ok)
    if token_auth?
      tokens = Auth::TokenIssuer.issue!(user)
      render json: Auth::SessionPayload.call(user, tokens), status: status
    else
      write_student_session(user)
      render json: Auth::SessionPayload.call(user), status: status
    end
  end

  def rate_limited
    render_error(:too_many_requests, :rate_limited)
  end
end
