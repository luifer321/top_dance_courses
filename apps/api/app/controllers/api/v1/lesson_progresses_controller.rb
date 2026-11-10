# frozen_string_literal: true

module Api
  module V1
    class LessonProgressesController < BaseController
      before_action :authenticate_student!

      def update
        lesson = Catalog::Lookup.lesson!(params[:course_slug], params[:lesson_slug], locale: request_locale)
        authorize lesson, :progress?
        row = LessonProgress.record!(
          user: current_student,
          lesson: lesson,
          position_seconds: params.require(:position_seconds),
          duration_seconds: params[:duration_seconds],
          ended: ActiveModel::Type::Boolean.new.cast(params[:ended])
        )

        render json: {
          progress: {
            position_seconds: row.position_seconds,
            completed: row.completed?
          }
        }
      end
    end
  end
end
