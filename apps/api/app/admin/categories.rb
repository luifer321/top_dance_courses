# frozen_string_literal: true

ActiveAdmin.register Category do
  menu priority: 2
  config.sort_order = "position_asc"

  permit_params :slug, :position, translations_attributes: %i[id locale name]

  controller do
    def scoped_collection
      super.includes(:translations)
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
    column :slug
    column("Spanish") { |category| category.name_for("es") }
    column("English") { |category| category.name_for("en") }
    column :position
    actions
  end

  filter :slug

  form do |f|
    f.semantic_errors
    f.inputs "Category" do
      f.input :slug, hint: "Stable id, for example salsa or bachata."
      f.input :position
    end

    div class: "admin-card" do
      h3 "Names"
      tabs do
        Content::LOCALES.each do |locale|
          tab locale.upcase do
            translation = f.object.translations.detect { |row| row.locale == locale } || f.object.translations.build(locale: locale)
            f.inputs class: "inputs locale-fields" do
              f.semantic_fields_for :translations, translation do |tf|
                tf.input :locale, as: :hidden
                tf.input :name
              end
            end
          end
        end
      end
    end

    f.actions
  end
end
