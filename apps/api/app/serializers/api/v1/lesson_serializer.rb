# frozen_string_literal: true

module Api
  module V1
    class LessonSerializer
      def initialize(lesson, requested_locale)
        @lesson = lesson
        @requested_locale = requested_locale.to_s
        @copy = LocalizedCopy.new(lesson, @requested_locale)
      end

      def summary
        {
          slug: @lesson.slug,
          title: @copy.title,
          duration_seconds: @lesson.duration_seconds,
          content_locale: @copy.content_locale
        }
      end

      def detail
        summary.merge(
          course_slug: @lesson.course.slug,
          description: @copy.description,
          original_language: @lesson.original_language,
          requested_locale: @requested_locale,
          available_languages: @lesson.available_languages,
          previous_slug: @lesson.previous_lesson&.slug,
          next_slug: @lesson.next_lesson&.slug
        )
      end
    end
  end
end
