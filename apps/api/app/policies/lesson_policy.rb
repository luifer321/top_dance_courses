# frozen_string_literal: true

class LessonPolicy < ApplicationPolicy
  def show?
    record.visible_to_students?
  end

  def playback?
    user.present? && record.visible_to_students?
  end
end
