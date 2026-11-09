# frozen_string_literal: true

ActiveAdmin.register Lesson do
  menu priority: 3

  permit_params :course_module_id, :slug, :position, :duration_seconds, :free_preview,
    translations_attributes: %i[id locale title description status _destroy],
    video_assets_attributes: %i[id provider_video_id language kind _destroy]

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
    f.inputs do
      f.input :course_module, collection: CourseModule.includes(:course, :translations).map { |mod|
        label = mod.translation_for(mod.course.original_language)&.title.presence || "Module #{mod.position}"
        [ "#{mod.course.slug} / #{label}", mod.id ]
      }
      f.input :slug
      f.input :position
      f.input :duration_seconds
      f.input :free_preview
    end

    tabs do
      Content::LOCALES.each do |locale|
        tab locale.upcase do
          translation = f.object.translations.detect { |row| row.locale == locale } || f.object.translations.build(locale: locale)
          f.semantic_fields_for :translations, translation do |tf|
            tf.input :locale, as: :hidden
            tf.input :title
            tf.input :description, as: :text
            tf.input :status, as: :select, collection: Content::TRANSLATION_STATUSES
          end
        end
      end
    end

    f.inputs "Bunny videos" do
      f.has_many :video_assets, allow_destroy: true, heading: false, new_record: "Add Bunny video" do |video_form|
        video_form.input :provider_video_id, label: "Bunny video GUID"
        video_form.input :language, as: :select, collection: Content::LOCALES
        video_form.input :kind, as: :select, collection: Content::VIDEO_KINDS
        if video_form.object.persisted?
          video_form.input :status, input_html: { disabled: true }
        end
      end
    end

    f.actions
  end
end
