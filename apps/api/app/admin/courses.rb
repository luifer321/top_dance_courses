# frozen_string_literal: true

ActiveAdmin.register Course do
  menu priority: 2

  permit_params :es_slug, :en_slug, :category_id, :level, :status, :cover_image,
    translations_attributes: %i[id locale title description status _destroy],
    course_modules_attributes: [
      :id, :position, :_destroy,
      { translations_attributes: %i[id locale title status _destroy] },
      { lessons_attributes: [
        :id, :position, :duration_seconds, :free_preview, :thumbnail, :es_slug, :en_slug,
        :es_video_guid, :en_video_guid, :_destroy,
        { translations_attributes: %i[id locale title subtitle description status _destroy] }
      ] }
    ]

  controller do
    def scoped_collection
      super.includes(:translations, :category)
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
    column("Slugs") { |course| "es: #{course.es_slug.presence || '—'} / en: #{course.en_slug.presence || '—'}" }
    column("Category") { |course| course.category&.admin_label || "—" }
    column(:level) { |course| course.level&.humanize }
    column(:status) { |course| course.status.humanize }
    column "Missing" do |course|
      course.missing_translation_summary
    end
    column :updated_at
    actions
  end

  filter :slug
  filter :category
  filter :level, as: :select, collection: -> { Content.select_options(Content::LEVELS) }
  filter :status, as: :select, collection: -> { Content.select_options(Content::COURSE_STATUSES) }
  filter :missing_translation, as: :select, collection: Content::LOCALES.map { |locale| [ locale.upcase, locale ] }

  show do
    attributes_table do
      row :slug
      row("Category") { |course| course.category&.admin_label }
      row(:level) { |course| course.level&.humanize }
      row(:status) { |course| course.status.humanize }
      row :cover_image_url
      row :published_at
      row("Missing") { |course| course.missing_translation_summary }
    end

    panel "Translations" do
      table_for resource.translations do
        column :locale
        column :slug
        column :title
        column :status
      end
    end

    resource.course_modules.each do |mod|
      panel "Module ##{mod.position} #{mod.any_title}" do
        table_for mod.lessons do
          column("Slugs") { |lesson| "es: #{lesson.es_slug.presence || '—'} / en: #{lesson.en_slug.presence || '—'}" }
          column :position
          column :duration_seconds
          column("Title") { |lesson| lesson.any_title }
          column("Video") { |lesson| lesson.video_assets.map { |asset| "#{asset.language}/#{asset.kind}: #{asset.status}" }.join(", ") }
        end
      end
    end
  end

  form do |f|
    f.semantic_errors

    f.inputs "Course" do
      f.input :es_slug, label: "Spanish slug", hint: "Public URL for Spanish, for example salsa-basica."
      f.input :en_slug, label: "English slug", hint: "Public URL for English. Leave blank if there is no English version."
      f.input :category, as: :select, collection: Category.order(:position, :slug).map { |category|
        [ category.admin_label, category.id ]
      }
      f.input :level, as: :select, collection: Content.select_options(Content::LEVELS), include_blank: true
      f.input :status, as: :select, collection: Content.select_options(Content::COURSE_STATUSES)
      f.input :cover_image, as: :file, label: "Cover image", hint: "JPG, PNG, or WebP, up to 5 MB. Courses without an image show a placeholder."
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
                tf.input :description, as: :text, input_html: { rows: 4 }
                tf.input :status, as: :select, collection: Content.select_options(Content::TRANSLATION_STATUSES)
              end
            end
          end
        end
      end
    end

    f.inputs "Modules" do
      f.has_many :course_modules, allow_destroy: true, heading: false, new_record: "Add module" do |module_form|
        module_form.object.ensure_locale_rows
        module_form.input :position

        module_form.has_many :translations, heading: "Module titles", new_record: false, allow_destroy: false do |tf|
          tf.input :locale, input_html: { readonly: true }
          tf.input :title
          tf.input :status, as: :select, collection: Content.select_options(Content::TRANSLATION_STATUSES)
        end

        module_form.has_many :lessons, allow_destroy: true, heading: "Lessons", new_record: "Add lesson" do |lesson_form|
          lesson_form.object.ensure_locale_rows
          lesson_form.input :es_slug, label: "Spanish slug", wrapper_html: { class: "locale-slug" }
          lesson_form.input :en_slug, label: "English slug", hint: "Leave blank if there is no English version.", wrapper_html: { class: "locale-slug" }
          lesson_form.input :position
          lesson_form.input :duration_seconds, label: "Duration (seconds)"
          lesson_form.input :free_preview
          lesson_form.input :thumbnail, as: :file, label: "Thumbnail", hint: "JPG, PNG, or WebP, up to 5 MB. Lessons without an image show a placeholder."

          lesson_form.has_many :translations, heading: "Lesson copy", new_record: false, allow_destroy: false do |tf|
            tf.input :locale, input_html: { readonly: true }
            tf.input :title
            tf.input :subtitle
            tf.input :description, as: :text, input_html: { rows: 3 }
            tf.input :status, as: :select, collection: Content.select_options(Content::TRANSLATION_STATUSES)
          end

          lesson_form.input :es_video_guid, label: "Spanish video", hint: lesson_form.object.video_guid_hint("es")
          lesson_form.input :en_video_guid, label: "English video", hint: lesson_form.object.video_guid_hint("en")
        end
      end
    end

    f.actions
  end
end
