# frozen_string_literal: true

class CategoryTranslation < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id category_id locale name created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[category].freeze

  belongs_to :category, inverse_of: :translations

  validates :locale, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :category_id }
  validates :name, presence: true
end
