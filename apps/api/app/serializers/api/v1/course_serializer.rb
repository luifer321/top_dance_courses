# frozen_string_literal: true

module Api
  module V1
    class CourseSerializer
      def initialize(course, requested_locale, progresses: nil)
        @course = course
        @requested_locale = requested_locale.to_s
        @copy = LocalizedCopy.new(course, @requested_locale)
        @progresses = progresses
      end

      def summary
        lessons = visible_lessons
        {
          slug: @course.public_slug(@requested_locale),
          localized_slugs: @course.localized_slugs,
          level: @course.level,
          category: category_payload,
          requested_locale: @requested_locale,
          content_locale: @copy.content_locale,
          title: @copy.title,
          description: @copy.description,
          cover_image_url: @course.display_cover_url,
          lesson_count: lessons.size,
          duration_seconds: total_duration(lessons),
          available_languages: @course.available_languages,
          progress: progress_payload(lessons)
        }
      end

      def detail
        summary.merge(modules: modules)
      end

      private

      def category_payload
        category = @course.category
        return nil unless category

        name = category.name_for(@requested_locale)
        return nil if name.blank?

        { slug: category.slug, name: name }
      end

      def modules
        @course.course_modules.filter_map do |mod|
          lessons = mod.lessons.select { |lesson| lesson.visible_to_students? && lesson.published_in?(@requested_locale) }
          next if lessons.empty?

          copy = LocalizedCopy.new(mod, @requested_locale)
          {
            position: mod.position,
            title: copy.title,
            content_locale: copy.content_locale,
            lessons: lessons.map { |lesson| LessonSerializer.new(lesson, @requested_locale, progresses: @progresses).summary }
          }
        end
      end

      def visible_lessons
        @course.lessons.select { |lesson| lesson.visible_to_students? && lesson.published_in?(@requested_locale) }
      end

      def progress_payload(lessons)
        return nil if @progresses.nil?
        return { completed_lessons: 0, lesson_count: 0, percent: 0 } if lessons.empty?

        completed = lessons.count { |lesson| @progresses[lesson.id]&.completed? }
        watched = lessons.sum { |lesson| watch_fraction(lesson) }
        {
          completed_lessons: completed,
          lesson_count: lessons.size,
          percent: (watched * 100 / lessons.size).round
        }
      end

      def watch_fraction(lesson)
        row = @progresses[lesson.id]
        return 0 unless row
        return 1 if row.completed?

        duration = lesson.duration_seconds.to_i
        return 0 if duration <= 0 || row.position_seconds <= 0

        [ row.position_seconds.to_f / duration, 0.99 ].min
      end

      def total_duration(lessons)
        total = lessons.filter_map(&:duration_seconds).sum
        total.positive? ? total : nil
      end
    end
  end
end
