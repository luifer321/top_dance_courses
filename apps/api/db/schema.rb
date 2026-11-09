# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_09_020000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "course_module_translations", force: :cascade do |t|
    t.bigint "course_module_id", null: false
    t.string "locale", null: false
    t.string "title", default: "", null: false
    t.string "status", default: "draft", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_module_id", "locale"], name: "idx_module_translations_on_module_and_locale", unique: true
    t.index ["course_module_id"], name: "index_course_module_translations_on_course_module_id"
    t.check_constraint "locale::text = ANY (ARRAY['es'::character varying, 'en'::character varying]::text[])", name: "course_module_translations_locale_check"
    t.check_constraint "status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying]::text[])", name: "course_module_translations_status_check"
  end

  create_table "course_modules", force: :cascade do |t|
    t.bigint "course_id", null: false
    t.integer "position", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id", "position"], name: "index_course_modules_on_course_id_and_position"
    t.index ["course_id"], name: "index_course_modules_on_course_id"
  end

  create_table "course_translations", force: :cascade do |t|
    t.bigint "course_id", null: false
    t.string "locale", null: false
    t.string "title", default: "", null: false
    t.text "description"
    t.string "status", default: "draft", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id", "locale"], name: "index_course_translations_on_course_id_and_locale", unique: true
    t.index ["course_id"], name: "index_course_translations_on_course_id"
    t.check_constraint "locale::text = ANY (ARRAY['es'::character varying, 'en'::character varying]::text[])", name: "course_translations_locale_check"
    t.check_constraint "status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying]::text[])", name: "course_translations_status_check"
  end

  create_table "courses", force: :cascade do |t|
    t.string "slug", null: false
    t.string "original_language", default: "es", null: false
    t.string "level"
    t.string "status", default: "draft", null: false
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_courses_on_slug", unique: true
    t.check_constraint "original_language::text = ANY (ARRAY['es'::character varying, 'en'::character varying]::text[])", name: "courses_original_language_check"
    t.check_constraint "status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying]::text[])", name: "courses_status_check"
  end

  create_table "lesson_translations", force: :cascade do |t|
    t.bigint "lesson_id", null: false
    t.string "locale", null: false
    t.string "title", default: "", null: false
    t.text "description"
    t.string "status", default: "draft", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id", "locale"], name: "index_lesson_translations_on_lesson_id_and_locale", unique: true
    t.index ["lesson_id"], name: "index_lesson_translations_on_lesson_id"
    t.check_constraint "locale::text = ANY (ARRAY['es'::character varying, 'en'::character varying]::text[])", name: "lesson_translations_locale_check"
    t.check_constraint "status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying]::text[])", name: "lesson_translations_status_check"
  end

  create_table "lessons", force: :cascade do |t|
    t.bigint "course_module_id", null: false
    t.string "slug", null: false
    t.integer "position", default: 0, null: false
    t.integer "duration_seconds"
    t.boolean "free_preview", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_module_id", "position"], name: "index_lessons_on_course_module_id_and_position"
    t.index ["course_module_id", "slug"], name: "index_lessons_on_course_module_id_and_slug", unique: true
    t.index ["course_module_id"], name: "index_lessons_on_course_module_id"
  end

  create_table "refresh_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token_digest", null: false
    t.uuid "family_id", null: false
    t.datetime "expires_at", null: false
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["family_id"], name: "index_refresh_tokens_on_family_id"
    t.index ["token_digest"], name: "index_refresh_tokens_on_token_digest", unique: true
    t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
  end

  create_table "subtitle_tracks", force: :cascade do |t|
    t.bigint "video_asset_id", null: false
    t.string "language", null: false
    t.string "provider_track_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["video_asset_id", "language"], name: "index_subtitle_tracks_on_video_asset_id_and_language", unique: true
    t.index ["video_asset_id"], name: "index_subtitle_tracks_on_video_asset_id"
    t.check_constraint "language::text = ANY (ARRAY['es'::character varying, 'en'::character varying]::text[])", name: "subtitle_tracks_language_check"
  end

  create_table "user_identities", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "provider", null: false
    t.string "uid", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "uid"], name: "index_user_identities_on_provider_and_uid", unique: true
    t.index ["user_id", "provider"], name: "index_user_identities_on_user_id_and_provider", unique: true
    t.index ["user_id"], name: "index_user_identities_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "preferred_locale", default: "es", null: false
    t.datetime "email_verified_at"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "video_assets", force: :cascade do |t|
    t.bigint "lesson_id", null: false
    t.string "language", null: false
    t.string "kind", default: "original", null: false
    t.string "provider", default: "bunny", null: false
    t.string "provider_video_id", null: false
    t.string "status", default: "processing", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lesson_id", "language", "kind"], name: "index_video_assets_on_lesson_id_and_language_and_kind", unique: true
    t.index ["lesson_id"], name: "index_video_assets_on_lesson_id"
    t.index ["provider_video_id"], name: "index_video_assets_on_provider_video_id"
    t.check_constraint "kind::text = ANY (ARRAY['original'::character varying, 'dubbed'::character varying]::text[])", name: "video_assets_kind_check"
    t.check_constraint "language::text = ANY (ARRAY['es'::character varying, 'en'::character varying]::text[])", name: "video_assets_language_check"
    t.check_constraint "status::text = ANY (ARRAY['processing'::character varying, 'ready'::character varying, 'failed'::character varying]::text[])", name: "video_assets_status_check"
  end

  add_foreign_key "course_module_translations", "course_modules"
  add_foreign_key "course_modules", "courses"
  add_foreign_key "course_translations", "courses"
  add_foreign_key "lesson_translations", "lessons"
  add_foreign_key "lessons", "course_modules"
  add_foreign_key "refresh_tokens", "users"
  add_foreign_key "subtitle_tracks", "video_assets"
  add_foreign_key "user_identities", "users"
  add_foreign_key "video_assets", "lessons"
end
