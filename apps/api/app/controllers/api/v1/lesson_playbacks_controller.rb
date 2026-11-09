# frozen_string_literal: true

module Api
  module V1
    class LessonPlaybacksController < BaseController
      before_action :authenticate_student!

      def show
        lesson = Catalog::Lookup.lesson!(params[:course_slug] || params[:slug], params[:lesson_slug])
        authorize lesson, :playback?

        asset = lesson.ready_video_asset
        unless asset && Bunny.configured_for_signing?
          return render_error(:unprocessable_content, :playback_unavailable)
        end

        render json: Bunny::SignedEmbed.call(asset.provider_video_id)
      end
    end
  end
end
