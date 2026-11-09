# frozen_string_literal: true

class Lesson < ApplicationRecord
  include Ransackable
  include HasLocaleTranslations

  RANSACK_ATTRIBUTES = %w[id course_module_id slug position duration_seconds free_preview created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[course_module translations video_assets].freeze

  belongs_to :course_module, inverse_of: :lessons
  has_one :course, through: :course_module
  has_many :translations, class_name: "LessonTranslation", dependent: :destroy, inverse_of: :lesson
  has_many :video_assets, dependent: :destroy, inverse_of: :lesson
  has_many :subtitle_tracks, through: :video_assets

  accepts_nested_attributes_for :translations, allow_destroy: true
  accepts_nested_attributes_for :video_assets, allow_destroy: true

  validates :slug, presence: true, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :slug, uniqueness: { scope: :course_module_id }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :duration_seconds, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  def original_language
    course.original_language
  end

  def visible_to_students?
    course.visible_to_students? && original_translation&.published?
  end

  def original_translation
    translation_for(original_language)
  end

  def ready_video_asset
    video_assets.detect(&:ready?)
  end

  def siblings_in_course
    course.lessons.to_a
  end

  def visible_siblings_in_course
    siblings_in_course.select(&:visible_to_students?)
  end

  def previous_lesson
    ordered = visible_siblings_in_course
    index = ordered.index { |row| row.id == id }
    return if index.nil? || index.zero?

    ordered[index - 1]
  end

  def next_lesson
    ordered = visible_siblings_in_course
    index = ordered.index { |row| row.id == id }
    return if index.nil?

    ordered[index + 1]
  end

  def available_languages
    {
      text: translations.select(&:published?).map(&:locale),
      audio: video_assets.select(&:ready?).map(&:language).uniq,
      subtitles: video_assets.select(&:ready?).flat_map { |asset| asset.subtitle_tracks.map(&:language) }.uniq
    }
  end
end
