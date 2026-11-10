# frozen_string_literal: true

class AddSlugToLessonTranslations < ActiveRecord::Migration[8.1]
  def change
    add_column :lesson_translations, :slug, :string
    add_index :lesson_translations, [ :locale, :slug ],
      where: "slug IS NOT NULL",
      name: "index_lesson_translations_on_locale_and_slug"
  end
end
