# frozen_string_literal: true

class CourseModuleTranslation < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id course_module_id locale title status created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[course_module].freeze

  belongs_to :course_module, inverse_of: :translations

  validates :locale, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :course_module_id }
  validates :status, inclusion: { in: Content::TRANSLATION_STATUSES }
  validates :title, presence: true, if: :published?

  def published?
    status == "published"
  end
end
