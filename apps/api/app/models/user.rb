# frozen_string_literal: true

# Student accounts for the web and mobile apps. Separate from AdminUser so
# public registration can never grant access to /admin.
class User < ApplicationRecord
  devise :database_authenticatable, :recoverable, :validatable

  has_many :identities, class_name: "UserIdentity", dependent: :destroy
  has_many :refresh_tokens, dependent: :destroy
  has_many :lesson_progresses, dependent: :destroy

  validates :name, presence: true, length: { maximum: 100 }
  validates :preferred_locale, inclusion: { in: I18n.available_locales.map(&:to_s) }

  before_validation :normalize_email

  attr_accessor :skip_password_requirement

  def password_required?
    return false if skip_password_requirement
    super
  end

  def has_password?
    encrypted_password.present?
  end

  private

  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end
