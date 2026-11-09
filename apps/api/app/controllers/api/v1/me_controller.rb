# frozen_string_literal: true

module Api
  module V1
    class MeController < BaseController
      before_action :authenticate_student!

      def show
        authorize current_student
        render json: UserSerializer.call(current_student)
      end

      def update
        authorize current_student
        if current_student.update(me_params)
          render json: UserSerializer.call(current_student)
        else
          render_unprocessable(current_student)
        end
      end

      private

      def me_params
        params.permit(:name, :preferred_locale)
      end
    end
  end
end
