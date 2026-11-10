# frozen_string_literal: true

class Lesson < ApplicationRecord
  include Ransackable
  include HasLocaleTranslations
  include LocaleSlugFields
  include ImageAttachment

  RANSACK_ATTRIBUTES = %w[id course_module_id slug position duration_seconds free_preview created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[course_module translations video_assets].freeze

  belongs_to :course_module, inverse_of: :lessons
  has_one :course, through: :course_module
  has_many :translations, ordered_translations_scope, class_name: "LessonTranslation", dependent: :destroy, inverse_of: :lesson
  has_many :video_assets, dependent: :destroy, inverse_of: :lesson
  has_many :subtitle_tracks, through: :video_assets
  image_attachment :thumbnail

  accepts_nested_attributes_for :translations, allow_destroy: true
  accepts_nested_attributes_for :video_assets, allow_destroy: true

  before_validation :discard_cleared_videos

  validates :slug, presence: true, format: { with: /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/ }
  validates :slug, uniqueness: { scope: :course_module_id }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :duration_seconds, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true

  def display_thumbnail_url
    MediaUrl.for(thumbnail) || thumbnail_url.presence
  end

  Content::LOCALES.each do |locale|
    define_method("#{locale}_video_guid") { video_guid_for(locale) }
    define_method("#{locale}_video_guid=") { |value| assign_video_guid(locale, value) }
  end

  def video_guid_hint(locale)
    language_name = locale == "es" ? "Spanish" : "English"
    hint = "Bunny video GUID. Leave blank if there is no #{language_name} version."
    status = existing_video_for(locale)&.status
    status ? "#{hint} Current status: #{status}." : hint
  end

  def visible_to_students?
    course.visible_to_students? && translations.any?(&:published?)
  end

  def ready_video_asset
    video_assets.detect(&:ready?)
  end

  def siblings_in_course
    course.lessons.to_a
  end

  def visible_siblings_in_course(locale = nil)
    siblings = siblings_in_course.select(&:visible_to_students?)
    return siblings if locale.blank?

    siblings.select { |row| row.published_in?(locale) }
  end

  def previous_lesson(locale = nil)
    ordered = visible_siblings_in_course(locale)
    index = ordered.index { |row| row.id == id }
    return if index.nil? || index.zero?

    ordered[index - 1]
  end

  def next_lesson(locale = nil)
    ordered = visible_siblings_in_course(locale)
    index = ordered.index { |row| row.id == id }
    return if index.nil?

    ordered[index + 1]
  end

  def video_guid_for(locale)
    asset = existing_video_for(locale)
    return if asset.nil? || asset.marked_for_destruction?

    asset.provider_video_id
  end

  def assign_video_guid(locale, value)
    guid = value.to_s.strip
    asset = existing_video_for(locale)
    if guid.blank?
      asset&.mark_for_destruction
      return
    end

    asset ||= video_assets.build(language: locale, kind: "original", provider: "bunny", status: "processing")
    asset.language = locale
    asset.provider_video_id = guid
  end

  def existing_video_for(locale)
    matches = video_assets.reject(&:marked_for_destruction?).select { |asset| asset.language == locale }
    matches.find { |asset| asset.kind == "original" } || matches.first
  end

  def available_languages
    {
      text: translations.select(&:published?).map(&:locale),
      audio: video_assets.select(&:ready?).map(&:language).uniq,
      subtitles: video_assets.select(&:ready?).flat_map { |asset| asset.subtitle_tracks.map(&:language) }.uniq
    }
  end

  private

  def discard_cleared_videos
    video_assets.each do |asset|
      asset.mark_for_destruction if asset.provider_video_id.blank?
    end
  end
end
