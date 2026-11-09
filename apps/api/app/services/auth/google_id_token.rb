# frozen_string_literal: true

require "googleauth/id_tokens"

module Auth
  class GoogleIdToken
    def self.client_ids
      ENV.fetch("GOOGLE_OAUTH_CLIENT_IDS", "").split(",").map(&:strip).reject(&:empty?)
    end

    def self.verify!(id_token)
      ids = client_ids
      raise GoogleUnavailable if ids.empty?
      raise InvalidGoogleToken if id_token.blank?

      Google::Auth::IDTokens.verify_oidc(id_token, aud: ids)
    rescue Google::Auth::IDTokens::VerificationError
      raise InvalidGoogleToken
    end
  end
end
