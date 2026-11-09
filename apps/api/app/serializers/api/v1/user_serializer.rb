# frozen_string_literal: true

module Api
  module V1
    class UserSerializer
      def self.call(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          preferred_locale: user.preferred_locale
        }
      end
    end
  end
end
