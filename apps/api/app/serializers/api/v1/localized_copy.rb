# frozen_string_literal: true

module Api
  module V1
    class LocalizedCopy
      def initialize(record, requested_locale)
        @record = record
        @requested_locale = requested_locale.to_s
        @translation = record.published_translation_for(@requested_locale)
      end

      def content_locale
        @translation&.locale || @record.original_language
      end

      def title
        @translation&.title.to_s
      end

      def description
        @translation&.try(:description)
      end
    end
  end
end
