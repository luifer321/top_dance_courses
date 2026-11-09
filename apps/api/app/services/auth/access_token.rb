# frozen_string_literal: true

module Auth
  class AccessToken
    TTL = 15.minutes
    ISSUER = "top-dance-api"

    def self.encode(user)
      JWT.encode(
        {
          sub: user.id.to_s,
          iat: Time.current.to_i,
          exp: TTL.from_now.to_i,
          iss: ISSUER
        },
        secret,
        "HS256"
      )
    end

    def self.decode(token)
      payload, = JWT.decode(token, secret, true, { algorithm: "HS256", iss: ISSUER, verify_iss: true })
      User.find_by(id: payload["sub"])
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end

    def self.secret
      Rails.application.key_generator.generate_key("student-access-tokens", 32)
    end
    private_class_method :secret
  end
end
