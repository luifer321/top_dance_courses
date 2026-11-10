# frozen_string_literal: true

module Content
  LOCALES = %w[es en].freeze
  TRANSLATION_STATUSES = %w[draft published].freeze
  COURSE_STATUSES = %w[draft published archived].freeze
  LEVELS = %w[beginner intermediate advanced].freeze
  VIDEO_KINDS = %w[original dubbed].freeze
  VIDEO_STATUSES = %w[processing ready failed].freeze

  ADMIN_LOCALE = "en"

  def self.select_options(values)
    values.map { |value| [ value.to_s.humanize, value ] }
  end
end
