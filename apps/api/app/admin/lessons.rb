# frozen_string_literal: true

ActiveAdmin.register Lesson do
  menu priority: 3

  permit_params :course_module_id, :position, :duration_seconds, :free_preview, :thumbnail,
    :es_slug, :en_slug, :es_video_guid, :en_video_guid,
    translations_attributes: %i[id locale title subtitle description status _destroy]

  controller do
    def scoped_collection
      super.includes(:translations, :video_assets, course_module: :course)
    end

    def build_resource
      super.tap(&:ensure_locale_rows)
    end

    def find_resource
      super.tap(&:ensure_locale_rows)
    end
  end

  index do
    selectable_column
    id_column
    column("Course") { |lesson| lesson.course.slug }
    column :slug
    column :position
    column("Missing") { |lesson| lesson.missing_translation_summary }
    column("Video") { |lesson| lesson.video_assets.map { |asset| "#{asset.language}: #{asset.status}" }.join(", ") }
    actions
  end

  filter :slug
  filter :missing_translation, as: :select, collection: Content::LOCALES.map { |locale| [ locale.upcase, locale ] }

  form do |f|
    f.semantic_errors
    f.inputs "Lesson" do
      f.input :course_module, collection: CourseModule.includes(:course, :translations).map { |mod|
        label = mod.any_title.presence || "Module #{mod.position}"
        [ "#{mod.course.slug} / #{label}", mod.id ]
      }
      f.input :es_slug, label: "Spanish slug"
      f.input :en_slug, label: "English slug", hint: "Leave blank if there is no English version."
      f.input :position
      f.input :duration_seconds, label: "Duration (seconds)"
      f.input :free_preview
      f.input :thumbnail, as: :file, label: "Thumbnail", hint: "JPG, PNG, or WebP, up to 5 MB. Lessons without an image show a placeholder."
    end

    div class: "admin-card" do
      h3 "Translations"
      tabs do
        Content::LOCALES.each do |locale|
          tab locale.upcase do
            translation = f.object.translations.detect { |row| row.locale == locale } || f.object.translations.build(locale: locale)
            f.inputs class: "inputs locale-fields" do
              f.semantic_fields_for :translations, translation do |tf|
                tf.input :locale, as: :hidden
                tf.input :title
                tf.input :subtitle
                tf.input :description, as: :text, input_html: { rows: 4 }
                tf.input :status, as: :select, collection: Content.select_options(Content::TRANSLATION_STATUSES)
              end
            end
          end
        end
      end
    end

    f.inputs "Videos" do
      f.input :es_video_guid, label: "Spanish video", hint: f.object.video_guid_hint("es")
      f.input :en_video_guid, label: "English video", hint: f.object.video_guid_hint("en")
    end

    f.actions
  end
end
