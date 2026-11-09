# frozen_string_literal: true

module Bunny
  module_function

  def library_id
    ENV["BUNNY_STREAM_LIBRARY_ID"].presence
  end

  def api_key
    ENV["BUNNY_STREAM_API_KEY"].presence
  end

  def token_auth_key
    ENV["BUNNY_STREAM_TOKEN_AUTH_KEY"].presence
  end

  def webhook_token
    ENV["BUNNY_STREAM_WEBHOOK_TOKEN"].presence
  end

  def configured_for_api?
    library_id.present? && api_key.present?
  end

  def configured_for_signing?
    library_id.present? && token_auth_key.present?
  end
end
