# frozen_string_literal: true

module Api
  module V1
    class CourseSerializer
      def initialize(course, requested_locale)
        @course = course
        @requested_locale = requested_locale.to_s
        @copy = LocalizedCopy.new(course, @requested_locale)
      end

      def summary
        {
          slug: @course.slug,
          level: @course.level,
          original_language: @course.original_language,
          requested_locale: @requested_locale,
          content_locale: @copy.content_locale,
          title: @copy.title,
          description: @copy.description,
          available_languages: @course.available_languages
        }
      end

      def detail
        summary.merge(modules: modules)
      end

      private

      def modules
        @course.course_modules.filter_map do |mod|
          lessons = mod.lessons.select(&:visible_to_students?)
          next if lessons.empty?

          copy = LocalizedCopy.new(mod, @requested_locale)
          {
            position: mod.position,
            title: copy.title,
            content_locale: copy.content_locale,
            lessons: lessons.map { |lesson| LessonSerializer.new(lesson, @requested_locale).summary }
          }
        end
      end
    end
  end
end
