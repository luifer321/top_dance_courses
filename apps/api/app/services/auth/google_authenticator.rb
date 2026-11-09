# frozen_string_literal: true

module Auth
  class GoogleAuthenticator
    def self.call(id_token:, locale:)
      new(id_token:, locale:).call
    end

    def initialize(id_token:, locale:)
      @id_token = id_token
      @locale = locale
    end

    def call
      payload = GoogleIdToken.verify!(@id_token)
      raise UnverifiedGoogleEmail unless truthy?(payload["email_verified"])

      email = payload["email"].to_s.downcase.strip
      uid = payload["sub"].to_s
      name = payload["name"].to_s.strip.presence || email.split("@").first
      raise InvalidGoogleToken if email.blank? || uid.blank?

      identity = UserIdentity.find_by(provider: "google", uid: uid)
      return identity.user if identity

      User.transaction { link_or_create!(email:, uid:, name:) }
    end

    private

    def link_or_create!(email:, uid:, name:)
      user = User.find_by(email: email)
      if user.nil?
        create_google_user!(email:, uid:, name:)
      elsif user.email_verified_at.blank?
        take_over_unverified!(user, uid:)
      else
        raise GoogleAccountConflict
      end
    end

    def create_google_user!(email:, uid:, name:)
      user = User.new(
        email: email,
        name: name,
        preferred_locale: @locale.to_s,
        email_verified_at: Time.current
      )
      user.skip_password_requirement = true
      user.save!
      user.identities.create!(provider: "google", uid: uid)
      user
    end

    def take_over_unverified!(user, uid:)
      user.skip_password_requirement = true
      user.encrypted_password = ""
      user.email_verified_at = Time.current
      user.save!
      user.identities.create!(provider: "google", uid: uid)
      user
    end

    def truthy?(value)
      value == true || value.to_s == "true"
    end
  end
end
