# frozen_string_literal: true

module Api
  module V1
    class LessonsController < BaseController
      def show
        lesson = Catalog::Lookup.lesson!(params[:course_slug] || params[:slug], params[:lesson_slug])
        authorize lesson
        render json: { lesson: LessonSerializer.new(lesson, request_locale).detail }
      end
    end
  end
end
