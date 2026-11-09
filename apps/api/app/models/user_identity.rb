# frozen_string_literal: true

class UserIdentity < ApplicationRecord
  PROVIDERS = %w[google].freeze

  belongs_to :user

  validates :provider, presence: true, inclusion: { in: PROVIDERS }
  validates :uid, presence: true
  validates :uid, uniqueness: { scope: :provider }
  validates :provider, uniqueness: { scope: :user_id }
end
