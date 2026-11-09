# frozen_string_literal: true

module Auth
  class TokenIssuer
    def self.issue!(user)
      {
        access_token: AccessToken.encode(user),
        refresh_token: RefreshToken.issue!(user),
        expires_in: AccessToken::TTL.to_i
      }
    end

    def self.rotate!(raw_refresh_token)
      user, new_raw = RefreshToken.redeem!(raw_refresh_token)
      return unless user

      {
        user: user,
        access_token: AccessToken.encode(user),
        refresh_token: new_raw,
        expires_in: AccessToken::TTL.to_i
      }
    end
  end
end
