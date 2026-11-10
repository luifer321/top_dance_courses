# frozen_string_literal: true

module ImageAttachment
  extend ActiveSupport::Concern

  IMAGE_TYPES = %w[image/jpeg image/png image/webp].freeze
  MAX_IMAGE_BYTES = 5.megabytes

  class_methods do
    def image_attachment(name)
      has_one_attached name

      validate do
        attachment = public_send(name)
        next unless attachment.attached?

        blob = attachment.blob
        next if blob.blank?

        errors.add(name, "must be a JPG, PNG, or WebP") unless IMAGE_TYPES.include?(blob.content_type)
        errors.add(name, "must be smaller than 5 MB") if blob.byte_size.to_i > MAX_IMAGE_BYTES
      end

      alias_method :"assign_#{name}", :"#{name}="
      define_method("#{name}=") do |attachable|
        public_send(:"assign_#{name}", attachable) if attachable.present?
      end
    end
  end
end
