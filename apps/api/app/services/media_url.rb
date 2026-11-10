# frozen_string_literal: true

module MediaUrl
  module_function

  def for(attachment)
    return unless attachment.respond_to?(:attached?) && attachment.attached?

    Rails.application.routes.url_helpers.rails_blob_url(attachment, **options)
  end

  def options
    configured = Rails.application.config.action_mailer.default_url_options.to_h.symbolize_keys
    configured[:protocol] ||= Rails.env.production? ? "https" : "http"
    configured[:host] ||= "localhost"
    configured[:port] ||= 3001 if configured[:host] == "localhost"
    configured
  end
end
