# frozen_string_literal: true

module Auth
  class Error < StandardError; end
  class InvalidGoogleToken < Error; end
  class UnverifiedGoogleEmail < Error; end
  class GoogleUnavailable < Error; end
  class GoogleAccountConflict < Error; end
end
