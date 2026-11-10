# frozen_string_literal: true

class AddCatalogMediaAndLessonSubtitle < ActiveRecord::Migration[8.1]
  def change
    add_column :courses, :cover_image_url, :string
    add_column :lessons, :thumbnail_url, :string
    add_column :lesson_translations, :subtitle, :string
  end
end
