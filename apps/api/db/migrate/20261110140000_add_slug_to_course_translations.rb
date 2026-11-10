# frozen_string_literal: true

class AddSlugToCourseTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :course_translations, :slug, :string
    add_index :course_translations, [ :locale, :slug ],
      unique: true,
      where: "slug IS NOT NULL",
      name: "index_course_translations_on_locale_and_slug"
  end
end
