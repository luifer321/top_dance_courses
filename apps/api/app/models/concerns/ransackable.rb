# frozen_string_literal: true

module Ransackable
  extend ActiveSupport::Concern

  class_methods do
    def ransackable_attributes(_auth_object = nil)
      const_defined?(:RANSACK_ATTRIBUTES) ? self::RANSACK_ATTRIBUTES : []
    end

    def ransackable_associations(_auth_object = nil)
      const_defined?(:RANSACK_ASSOCIATIONS) ? self::RANSACK_ASSOCIATIONS : []
    end
  end
end
