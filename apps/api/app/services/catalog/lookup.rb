# frozen_string_literal: true

module Catalog
  class Lookup
    def self.courses
      Course.visible.with_catalog_includes.order(:slug)
    end

    def self.course!(slug)
      course = Course.with_catalog_includes.find_by(slug: slug)
      raise ActiveRecord::RecordNotFound unless course&.visible_to_students?

      course
    end

    def self.lesson!(course_slug, lesson_slug)
      course = course!(course_slug)
      lesson = course.lessons.detect { |row| row.slug == lesson_slug }
      raise ActiveRecord::RecordNotFound unless lesson&.visible_to_students?

      lesson
    end
  end
end
