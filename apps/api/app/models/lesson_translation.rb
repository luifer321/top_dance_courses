# frozen_string_literal: true

class LessonTranslation < ApplicationRecord
  include Ransackable

  SLUG_FORMAT = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/

  RANSACK_ATTRIBUTES = %w[id lesson_id locale title slug status created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[lesson].freeze

  belongs_to :lesson, inverse_of: :translations

  before_validation :normalize_slug

  validates :locale, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :lesson_id }
  validates :status, inclusion: { in: Content::TRANSLATION_STATUSES }
  validates :title, presence: true, if: :published?
  validates :slug, format: { with: SLUG_FORMAT }, allow_nil: true
  validate :slug_unique_in_course

  def published?
    status == "published"
  end

  private

  def normalize_slug
    self.slug = slug.to_s.strip.downcase.presence
  end

  def slug_unique_in_course
    return if slug.blank? || lesson.nil?

    course_id = lesson.course_module&.course_id
    return if course_id.blank?

    siblings = Lesson.joins(:course_module).where(course_modules: { course_id: course_id }).where.not(id: lesson_id)
    if siblings.exists?(slug: slug) || LessonTranslation.where(lesson_id: siblings.select(:id), locale: locale, slug: slug).exists?
      errors.add(:slug, "is already used by another lesson in this course")
    end
  end
end
