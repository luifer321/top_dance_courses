# frozen_string_literal: true

class CreateCourseContent < ActiveRecord::Migration[8.1]
  def change
    create_table :courses do |t|
      t.string :slug, null: false
      t.string :original_language, null: false, default: "es"
      t.string :level
      t.string :status, null: false, default: "draft"
      t.datetime :published_at
      t.timestamps null: false
    end
    add_index :courses, :slug, unique: true
    add_check_constraint :courses, "original_language IN ('es', 'en')", name: "courses_original_language_check"
    add_check_constraint :courses, "status IN ('draft', 'published', 'archived')", name: "courses_status_check"

    create_table :course_translations do |t|
      t.references :course, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title, null: false, default: ""
      t.text :description
      t.string :status, null: false, default: "draft"
      t.timestamps null: false
    end
    add_index :course_translations, [ :course_id, :locale ], unique: true
    add_check_constraint :course_translations, "locale IN ('es', 'en')", name: "course_translations_locale_check"
    add_check_constraint :course_translations, "status IN ('draft', 'published')", name: "course_translations_status_check"

    create_table :course_modules do |t|
      t.references :course, null: false, foreign_key: true
      t.integer :position, null: false, default: 0
      t.timestamps null: false
    end
    add_index :course_modules, [ :course_id, :position ]

    create_table :course_module_translations do |t|
      t.references :course_module, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title, null: false, default: ""
      t.string :status, null: false, default: "draft"
      t.timestamps null: false
    end
    add_index :course_module_translations, [ :course_module_id, :locale ], unique: true, name: "idx_module_translations_on_module_and_locale"
    add_check_constraint :course_module_translations, "locale IN ('es', 'en')", name: "course_module_translations_locale_check"
    add_check_constraint :course_module_translations, "status IN ('draft', 'published')", name: "course_module_translations_status_check"

    create_table :lessons do |t|
      t.references :course_module, null: false, foreign_key: true
      t.string :slug, null: false
      t.integer :position, null: false, default: 0
      t.integer :duration_seconds
      t.boolean :free_preview, null: false, default: false
      t.timestamps null: false
    end
    add_index :lessons, [ :course_module_id, :slug ], unique: true
    add_index :lessons, [ :course_module_id, :position ]

    create_table :lesson_translations do |t|
      t.references :lesson, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :title, null: false, default: ""
      t.text :description
      t.string :status, null: false, default: "draft"
      t.timestamps null: false
    end
    add_index :lesson_translations, [ :lesson_id, :locale ], unique: true
    add_check_constraint :lesson_translations, "locale IN ('es', 'en')", name: "lesson_translations_locale_check"
    add_check_constraint :lesson_translations, "status IN ('draft', 'published')", name: "lesson_translations_status_check"

    create_table :video_assets do |t|
      t.references :lesson, null: false, foreign_key: true
      t.string :language, null: false
      t.string :kind, null: false, default: "original"
      t.string :provider, null: false, default: "bunny"
      t.string :provider_video_id, null: false
      t.string :status, null: false, default: "processing"
      t.timestamps null: false
    end
    add_index :video_assets, [ :lesson_id, :language, :kind ], unique: true
    add_index :video_assets, :provider_video_id
    add_check_constraint :video_assets, "language IN ('es', 'en')", name: "video_assets_language_check"
    add_check_constraint :video_assets, "kind IN ('original', 'dubbed')", name: "video_assets_kind_check"
    add_check_constraint :video_assets, "status IN ('processing', 'ready', 'failed')", name: "video_assets_status_check"

    create_table :subtitle_tracks do |t|
      t.references :video_asset, null: false, foreign_key: true
      t.string :language, null: false
      t.string :provider_track_id
      t.timestamps null: false
    end
    add_index :subtitle_tracks, [ :video_asset_id, :language ], unique: true
    add_check_constraint :subtitle_tracks, "language IN ('es', 'en')", name: "subtitle_tracks_language_check"
  end
end
