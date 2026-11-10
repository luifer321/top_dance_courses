# frozen_string_literal: true

module Catalog
  class Lookup
    def self.courses(locale:)
      published_ids = CourseTranslation.where(locale: locale.to_s, status: "published").select(:course_id)
      Course.visible.where(id: published_ids).with_catalog_includes.order(:slug)
    end

    def self.course!(slug, locale: nil)
      course = locate_course(slug, locale)
      raise ActiveRecord::RecordNotFound unless course&.visible_to_students?
      raise ActiveRecord::RecordNotFound if locale.present? && !course.published_in?(locale)

      course
    end

    def self.lesson!(course_slug, lesson_slug, locale: nil)
      course = course!(course_slug, locale: locale)
      lesson = locate_lesson(course, lesson_slug, locale)
      raise ActiveRecord::RecordNotFound unless lesson&.visible_to_students?
      raise ActiveRecord::RecordNotFound if locale.present? && !lesson.published_in?(locale)

      lesson
    end

    # Prefer a published translation slug for the requested locale, then the
    # stable course slug. Both keep resolving so older links do not 404.
    def self.locate_course(slug, locale)
      if locale.present?
        translation = CourseTranslation.find_by(locale: locale.to_s, slug: slug, status: "published")
        if translation
          found = Course.with_catalog_includes.find_by(id: translation.course_id)
          return found if found
        end
      end

      Course.with_catalog_includes.find_by(slug: slug)
    end

    # Prefer a published translation slug, then the stable lesson slug.
    def self.locate_lesson(course, lesson_slug, locale)
      if locale.present?
        match = course.lessons.detect do |row|
          translation = row.translation_for(locale)
          translation&.published? && translation.slug == lesson_slug
        end
        return match if match
      end

      course.lessons.detect { |row| row.slug == lesson_slug }
    end
    private_class_method :locate_course, :locate_lesson
  end
end
