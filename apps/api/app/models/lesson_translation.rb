# frozen_string_literal: true

class LessonTranslation < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id lesson_id locale title status created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[lesson].freeze

  belongs_to :lesson, inverse_of: :translations

  validates :locale, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :lesson_id }
  validates :status, inclusion: { in: Content::TRANSLATION_STATUSES }
  validates :title, presence: true, if: :published?

  def published?
    status == "published"
  end
end
