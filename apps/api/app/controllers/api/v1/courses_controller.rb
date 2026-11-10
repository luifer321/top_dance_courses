# frozen_string_literal: true

module Api
  module V1
    class CoursesController < BaseController
      def index
        authorize Course
        courses = Catalog::Lookup.courses(locale: request_locale)
        progresses = LessonProgress.lookup(current_student, courses)
        render json: { courses: courses.map { |course| CourseSerializer.new(course, request_locale, progresses: progresses).summary } }
      end

      def show
        course = Catalog::Lookup.course!(params[:slug], locale: request_locale)
        authorize course
        progresses = LessonProgress.lookup(current_student, [ course ])
        render json: { course: CourseSerializer.new(course, request_locale, progresses: progresses).detail }
      end
    end
  end
end
