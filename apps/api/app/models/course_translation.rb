# frozen_string_literal: true

class CourseTranslation < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id course_id locale title status created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[course].freeze

  belongs_to :course, inverse_of: :translations

  validates :locale, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :course_id }
  validates :status, inclusion: { in: Content::TRANSLATION_STATUSES }
  validates :title, presence: true, if: :published?

  def published?
    status == "published"
  end
end
