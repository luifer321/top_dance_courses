# frozen_string_literal: true

class Course < ApplicationRecord
  include Ransackable
  include HasLocaleTranslations
  include LocaleSlugFields
  include ImageAttachment

  RANSACK_ATTRIBUTES = %w[id slug category_id level status published_at created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[category translations course_modules lessons].freeze

  belongs_to :category, optional: true, inverse_of: :courses
  has_many :translations, ordered_translations_scope, class_name: "CourseTranslation", dependent: :destroy, inverse_of: :course
  has_many :course_modules, -> { order(:position, :id) }, dependent: :destroy, inverse_of: :course
  has_many :lessons, through: :course_modules
  image_attachment :cover_image

  accepts_nested_attributes_for :translations, allow_destroy: true
  accepts_nested_attributes_for :course_modules, allow_destroy: true

  validates :slug, presence: true, uniqueness: true, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :status, inclusion: { in: Content::COURSE_STATUSES }
  validates :level, inclusion: { in: Content::LEVELS }, allow_blank: true
  validate :has_published_translation, if: :published?

  scope :published, -> { where(status: "published") }
  scope :visible, -> {
    published
      .joins(:translations)
      .where(course_translations: { status: "published" })
      .distinct
  }

  scope :with_catalog_includes, -> {
    includes(
      :translations,
      { category: :translations },
      { cover_image_attachment: :blob },
      course_modules: {
        translations: [],
        lessons: { translations: [], thumbnail_attachment: :blob, video_assets: :subtitle_tracks }
      }
    )
  }

  before_validation :assign_published_at

  def published?
    status == "published"
  end

  def display_cover_url
    MediaUrl.for(cover_image) || cover_image_url.presence
  end

  def visible_to_students?
    published? && translations.any? { |row| row.published? && row.title.present? }
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

  def has_published_translation
    return if translations.any? { |row| row.published? && row.title.present? }

    errors.add(:status, "requires a published translation with a title")
  end
end
