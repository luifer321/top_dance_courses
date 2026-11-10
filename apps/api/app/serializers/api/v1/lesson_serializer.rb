# frozen_string_literal: true

module Api
  module V1
    class LessonSerializer
      def initialize(lesson, requested_locale, progresses: nil)
        @lesson = lesson
        @requested_locale = requested_locale.to_s
        @copy = LocalizedCopy.new(lesson, @requested_locale)
        @progresses = progresses
      end

      def summary
        {
          slug: @lesson.public_slug(@requested_locale),
          title: @copy.title,
          subtitle: @copy.subtitle,
          duration_seconds: @lesson.duration_seconds,
          thumbnail_url: @lesson.display_thumbnail_url,
          free_preview: @lesson.free_preview,
          content_locale: @copy.content_locale,
          completed: completed?
        }
      end

      def detail
        summary.merge(
          course_slug: @lesson.course.public_slug(@requested_locale),
          localized_slugs: @lesson.course.localized_slugs,
          localized_lesson_slugs: @lesson.localized_slugs,
          description: @copy.description,
          requested_locale: @requested_locale,
          available_languages: @lesson.available_languages,
          previous_slug: @lesson.previous_lesson(@requested_locale)&.public_slug(@requested_locale),
          next_slug: @lesson.next_lesson(@requested_locale)&.public_slug(@requested_locale)
        )
      end

      private

      def completed?
        return false if @progresses.nil?

        @progresses[@lesson.id]&.completed? || false
      end
    end
  end
end
