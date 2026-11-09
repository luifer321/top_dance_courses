# frozen_string_literal: true

class CourseModule < ApplicationRecord
  include Ransackable
  include HasLocaleTranslations

  RANSACK_ATTRIBUTES = %w[id course_id position created_at updated_at].freeze
  RANSACK_ASSOCIATIONS = %w[course translations lessons].freeze

  belongs_to :course, inverse_of: :course_modules
  has_many :translations, class_name: "CourseModuleTranslation", dependent: :destroy, inverse_of: :course_module
  has_many :lessons, -> { order(:position, :id) }, dependent: :destroy, inverse_of: :course_module

  accepts_nested_attributes_for :translations, allow_destroy: true
  accepts_nested_attributes_for :lessons, allow_destroy: true

  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def original_language
    course.original_language
  end
end
