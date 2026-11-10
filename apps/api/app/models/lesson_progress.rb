# frozen_string_literal: true

class LessonProgress < ApplicationRecord
  COMPLETION_RATIO = 0.9

  belongs_to :user
  belongs_to :lesson

  validates :position_seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  def completed?
    completed_at.present?
  end

  def self.lookup(student, courses)
    return nil unless student

    lesson_ids = courses.flat_map { |course| course.lessons.map(&:id) }
    where(user_id: student.id, lesson_id: lesson_ids).index_by(&:lesson_id)
  end

  def self.record!(user:, lesson:, position_seconds:, duration_seconds:, ended:)
    row = find_or_initialize_by(user: user, lesson: lesson)
    position = position_seconds.to_i.clamp(0, 86_400)
    row.position_seconds = [ row.position_seconds.to_i, position ].max
    row.last_watched_at = Time.current

    limit = duration_seconds.to_i
    limit = lesson.duration_seconds.to_i unless limit.positive?
    if ended || (limit.positive? && position >= (limit * COMPLETION_RATIO).floor)
      row.completed_at ||= Time.current
    end

    row.save!
    row
  end
end
