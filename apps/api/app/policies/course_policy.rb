# frozen_string_literal: true

class CoursePolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    record.visible_to_students?
  end
end
