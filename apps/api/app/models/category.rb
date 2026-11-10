# frozen_string_literal: true

class Category < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id slug position created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[translations courses].freeze

  has_many :translations, -> { in_order_of(:locale, Content::LOCALES) }, class_name: "CategoryTranslation", dependent: :destroy, inverse_of: :category
  has_many :courses, dependent: :restrict_with_error, inverse_of: :category

  accepts_nested_attributes_for :translations

  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def ensure_locale_rows
    Content::LOCALES.each do |locale|
      translations.find_or_initialize_by(locale: locale)
    end
    self
  end

  def name_for(locale)
    translations.detect { |row| row.locale == locale.to_s && row.name.present? }&.name
  end

  def admin_label
    name_for(Content::ADMIN_LOCALE).presence || slug.humanize
  end

  def to_s
    admin_label
  end
end
