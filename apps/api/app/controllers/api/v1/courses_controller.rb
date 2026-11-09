# frozen_string_literal: true

module Api
  module V1
    class CoursesController < BaseController
      def index
        authorize Course
        courses = Catalog::Lookup.courses.map { |course| CourseSerializer.new(course, request_locale).summary }
        render json: { courses: courses }
      end

      def show
        course = Catalog::Lookup.course!(params[:slug])
        authorize course
        render json: { course: CourseSerializer.new(course, request_locale).detail }
      end
    end
  end
end
