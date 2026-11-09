# frozen_string_literal: true

class RefreshToken < ApplicationRecord
  TTL = 30.days

  belongs_to :user

  def self.digest(raw)
    Digest::SHA256.hexdigest(raw)
  end

  def self.issue!(user, family_id: SecureRandom.uuid)
    raw = SecureRandom.urlsafe_base64(32)
    create!(
      user: user,
      token_digest: digest(raw),
      family_id: family_id,
      expires_at: TTL.from_now
    )
    raw
  end

  # Returns [user, new_raw_token] or nil. Reuse of a rotated token revokes the family.
  def self.redeem!(raw)
    return if raw.blank?

    token = find_by(token_digest: digest(raw))
    return if token.nil?

    if token.revoked_at.present?
      revoke_family!(token.family_id)
      return
    end

    return if token.expires_at <= Time.current

    new_raw = token.rotate!
    [ token.user, new_raw ]
  end

  def self.revoke_family!(family_id)
    where(family_id: family_id, revoked_at: nil).update_all(revoked_at: Time.current)
  end

  def self.revoke_presented!(raw)
    return if raw.blank?

    token = find_by(token_digest: digest(raw))
    revoke_family!(token.family_id) if token
  end

  def rotate!
    transaction do
      update!(revoked_at: Time.current)
      self.class.issue!(user, family_id: family_id)
    end
  end
end
