# frozen_string_literal: true

module Auth
  class SessionPayload
    def self.call(user, tokens = nil)
      payload = { user: Api::V1::UserSerializer.call(user) }
      return payload unless tokens

      payload.merge(
        access_token: tokens.fetch(:access_token),
        refresh_token: tokens.fetch(:refresh_token),
        expires_in: tokens.fetch(:expires_in)
      )
    end
  end
end
