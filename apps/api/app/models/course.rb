# frozen_string_literal: true

class Course < ApplicationRecord
  include Ransackable
  include HasLocaleTranslations

  RANSACK_ATTRIBUTES = %w[id slug original_language level status published_at created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[translations course_modules lessons].freeze

  has_many :translations, class_name: "CourseTranslation", dependent: :destroy, inverse_of: :course
  has_many :course_modules, -> { order(:position, :id) }, dependent: :destroy, inverse_of: :course
  has_many :lessons, through: :course_modules

  accepts_nested_attributes_for :translations, allow_destroy: true
  accepts_nested_attributes_for :course_modules, allow_destroy: true

  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :original_language, inclusion: { in: Content::LOCALES }
  validates :status, inclusion: { in: Content::COURSE_STATUSES }
  validates :level, inclusion: { in: Content::LEVELS }, allow_blank: true
  validate :original_language_must_be_published, if: :published?

  scope :published, -> { where(status: "published") }
  scope :visible, -> {
    published
      .joins(:translations)
      .where(course_translations: { status: "published" })
      .where("course_translations.locale = courses.original_language")
      .distinct
  }

  scope :with_catalog_includes, -> {
    includes(
      :translations,
      course_modules: {
        translations: [],
        lessons: { translations: [], video_assets: :subtitle_tracks }
      }
    )
  }

  before_validation :assign_published_at

  def published?
    status == "published"
  end

  def original_translation
    translation_for(original_language)
  end

  def visible_to_students?
    published? && original_translation&.published?
  end

  def available_languages
    published_lessons = lessons.select(&:visible_to_students?)

    {
      text: translations.select(&:published?).map(&:locale),
      audio: published_lessons.flat_map { |lesson| lesson.video_assets.select(&:ready?).map(&:language) }.uniq,
      subtitles: published_lessons.flat_map { |lesson|
        lesson.video_assets.select(&:ready?).flat_map { |asset| asset.subtitle_tracks.map(&:language) }
      }.uniq
    }
  end

  private

  def assign_published_at
    if published?
      self.published_at ||= Time.current
    elsif will_save_change_to_status? && status_in_database == "published"
      self.published_at = nil
    end
  end

  def original_language_must_be_published
    translation = original_translation
    return if translation&.published? && translation.title.present?

    errors.add(:status, "requires a published #{original_language} translation with a title")
  end
end
