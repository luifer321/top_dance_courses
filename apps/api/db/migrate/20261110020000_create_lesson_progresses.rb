# frozen_string_literal: true

class CreateLessonProgresses < ActiveRecord::Migration[8.1]
  def change
    create_table :lesson_progresses do |t|
      t.references :user, null: false, foreign_key: true
      t.references :lesson, null: false, foreign_key: true
      t.integer :position_seconds, null: false, default: 0
      t.datetime :completed_at
      t.datetime :last_watched_at, null: false
      t.timestamps
    end

    add_index :lesson_progresses, [ :user_id, :lesson_id ], unique: true
  end
end
