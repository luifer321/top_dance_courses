# frozen_string_literal: true

class CourseTranslation < ApplicationRecord
  include Ransackable

  SLUG_FORMAT = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/

  RANSACK_ATTRIBUTES = %w[id course_id locale title slug status created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[course].freeze

  belongs_to :course, inverse_of: :translations

  before_validation :normalize_slug

  validates :locale, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :course_id }
  validates :status, inclusion: { in: Content::TRANSLATION_STATUSES }
  validates :title, presence: true, if: :published?
  validates :slug, format: { with: SLUG_FORMAT }, uniqueness: { scope: :locale }, allow_nil: true
  validate :slug_belongs_to_this_course

  def public_slug
    slug.presence || course.slug
  end

  def published?
    status == "published"
  end

  private

  def normalize_slug
    self.slug = slug.to_s.strip.downcase.presence
  end

  def slug_belongs_to_this_course
    return if slug.blank?

    taken = Course.where(slug: slug).where.not(id: course_id).exists?
    errors.add(:slug, "is already used by another course") if taken
  end
end
