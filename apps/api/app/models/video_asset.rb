# frozen_string_literal: true

class VideoAsset < ApplicationRecord
  include Ransackable

  RANSACK_ATTRIBUTES = %w[id lesson_id language kind provider provider_video_id status created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[lesson subtitle_tracks].freeze

  belongs_to :lesson, inverse_of: :video_assets
  has_many :subtitle_tracks, dependent: :destroy, inverse_of: :video_asset

  accepts_nested_attributes_for :subtitle_tracks, allow_destroy: true

  validates :language, inclusion: { in: Content::LOCALES }
  validates :kind, inclusion: { in: Content::VIDEO_KINDS }
  validates :status, inclusion: { in: Content::VIDEO_STATUSES }
  validates :provider, inclusion: { in: %w[bunny] }
  validates :provider_video_id, presence: true
  validates :kind, uniqueness: { scope: [ :lesson_id, :language ] }

  after_commit :sync_bunny_status, on: %i[create update]

  def ready?
    status == "ready"
  end

  def sync_bunny_status
    return unless saved_change_to_provider_video_id?
    return if provider_video_id.blank?
    return unless Bunny.configured_for_api?

    result = Bunny::VideoStatus.fetch(provider_video_id)
    update_column(:status, result) if result.present? && result != status
  end
end
