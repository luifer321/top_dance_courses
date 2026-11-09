# frozen_string_literal: true

ActiveAdmin.register Course do
  menu priority: 2

  permit_params :slug, :original_language, :level, :status,
    translations_attributes: %i[id locale title description status _destroy],
    course_modules_attributes: [
      :id, :position, :_destroy,
      { translations_attributes: %i[id locale title status _destroy] },
      { lessons_attributes: [
        :id, :slug, :position, :duration_seconds, :free_preview, :_destroy,
        { translations_attributes: %i[id locale title description status _destroy] },
        { video_assets_attributes: %i[id provider_video_id language kind _destroy] }
      ] }
    ]

  controller do
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
    column :slug
    column :original_language
    column :level
    column :status
    column "Missing" do |course|
      course.missing_translation_summary
    end
    column :updated_at
    actions
  end

  filter :slug
  filter :original_language, as: :select, collection: Content::LOCALES
  filter :level, as: :select, collection: Content::LEVELS
  filter :status, as: :select, collection: Content::COURSE_STATUSES
  filter :missing_translation, as: :select, collection: Content::LOCALES.map { |locale| [ locale.upcase, locale ] }

  show do
    attributes_table do
      row :slug
      row :original_language
      row :level
      row :status
      row :published_at
      row("Missing") { |course| course.missing_translation_summary }
    end

    panel "Translations" do
      table_for resource.translations.order(:locale) do
        column :locale
        column :title
        column :status
      end
    end

    resource.course_modules.each do |mod|
      panel "Module ##{mod.position} #{mod.translation_for(resource.original_language)&.title}" do
        table_for mod.lessons do
          column :slug
          column :position
          column :duration_seconds
          column("Title") { |lesson| lesson.translation_for(resource.original_language)&.title }
          column("Video") { |lesson| lesson.video_assets.map { |asset| "#{asset.language}/#{asset.kind}: #{asset.status}" }.join(", ") }
        end
      end
    end
  end

  form do |f|
    f.semantic_errors
    f.inputs "Course" do
      f.input :slug
      f.input :original_language, as: :select, collection: Content::LOCALES
      f.input :level, as: :select, collection: Content::LEVELS, include_blank: true
      f.input :status, as: :select, collection: Content::COURSE_STATUSES
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

    f.inputs "Modules" do
      f.has_many :course_modules, allow_destroy: true, heading: false, new_record: "Add module" do |module_form|
        module_form.object.ensure_locale_rows
        module_form.input :position
        Content::LOCALES.each do |locale|
          translation = module_form.object.translations.detect { |row| row.locale == locale } || module_form.object.translations.build(locale: locale)
          module_form.semantic_fields_for :translations, translation do |tf|
            tf.inputs "#{locale.upcase} module title" do
              tf.input :locale, as: :hidden
              tf.input :title, label: "#{locale.upcase} title"
              tf.input :status, as: :select, collection: Content::TRANSLATION_STATUSES
            end
          end
        end

        module_form.has_many :lessons, allow_destroy: true, heading: "Lessons", new_record: "Add lesson" do |lesson_form|
          lesson_form.object.ensure_locale_rows
          lesson_form.input :slug
          lesson_form.input :position
          lesson_form.input :duration_seconds
          lesson_form.input :free_preview
          Content::LOCALES.each do |locale|
            translation = lesson_form.object.translations.detect { |row| row.locale == locale } || lesson_form.object.translations.build(locale: locale)
            lesson_form.semantic_fields_for :translations, translation do |tf|
              tf.inputs "#{locale.upcase} lesson" do
                tf.input :locale, as: :hidden
                tf.input :title, label: "#{locale.upcase} title"
                tf.input :description, as: :text, label: "#{locale.upcase} description"
                tf.input :status, as: :select, collection: Content::TRANSLATION_STATUSES
              end
            end
          end

          lesson_form.has_many :video_assets, allow_destroy: true, heading: "Bunny videos", new_record: "Add Bunny video" do |video_form|
            video_form.input :provider_video_id, label: "Bunny video GUID"
            video_form.input :language, as: :select, collection: Content::LOCALES
            video_form.input :kind, as: :select, collection: Content::VIDEO_KINDS
            if video_form.object.persisted?
              video_form.input :status, input_html: { disabled: true }
            end
          end
        end
      end
    end

    f.actions
  end
end
