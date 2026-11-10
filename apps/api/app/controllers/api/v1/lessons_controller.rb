# frozen_string_literal: true

module Api
  module V1
    class LessonsController < BaseController
      def show
        lesson = Catalog::Lookup.lesson!(params[:course_slug] || params[:slug], params[:lesson_slug], locale: request_locale)
        authorize lesson
        progresses = LessonProgress.lookup(current_student, [ lesson.course ])
        render json: { lesson: LessonSerializer.new(lesson, request_locale, progresses: progresses).detail }
      end
    end
  end
end
