# frozen_string_literal: true

class SubtitleTrack < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id video_asset_id language provider_track_id created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[video_asset].freeze

  belongs_to :video_asset, inverse_of: :subtitle_tracks

  validates :language, presence: true, inclusion: { in: Content::LOCALES }, uniqueness: { scope: :video_asset_id }
end
