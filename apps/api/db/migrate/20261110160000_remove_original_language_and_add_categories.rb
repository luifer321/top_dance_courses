# frozen_string_literal: true

class RemoveOriginalLanguageAndAddCategories < ActiveRecord::Migration[8.1]
  CATEGORIES = [
    [ "salsa", 0, "Salsa", "Salsa" ],
    [ "bachata", 1, "Bachata", "Bachata" ],
    [ "urban", 2, "Urbano", "Urban" ],
    [ "champeta", 3, "Champeta", "Champeta" ]
  ].freeze

  def change
    create_table :categories do |t|
      t.string :slug, null: false
      t.integer :position, null: false, default: 0
      t.timestamps
    end
    add_index :categories, :slug, unique: true

    create_table :category_translations do |t|
      t.references :category, null: false, foreign_key: true
      t.string :locale, null: false
      t.string :name, null: false, default: ""
      t.timestamps
    end
    add_index :category_translations, [ :category_id, :locale ],
      unique: true,
      name: "index_category_translations_on_category_and_locale"
    add_check_constraint :category_translations, "locale IN ('es', 'en')", name: "category_translations_locale_check"

    add_reference :courses, :category, foreign_key: true

    reversible do |dir|
      dir.up { seed_categories }
    end

    remove_check_constraint :courses, name: "courses_original_language_check"
    remove_column :courses, :original_language, :string, default: "es", null: false
  end

  private

  def seed_categories
    now = connection.quote(Time.current)
    CATEGORIES.each do |slug, position, spanish, english|
      connection.execute(<<~SQL.squish)
        INSERT INTO categories (slug, position, created_at, updated_at)
        VALUES (#{connection.quote(slug)}, #{position.to_i}, #{now}, #{now})
      SQL
      category_id = connection.select_value("SELECT id FROM categories WHERE slug = #{connection.quote(slug)}")
      [ [ "es", spanish ], [ "en", english ] ].each do |locale, name|
        connection.execute(<<~SQL.squish)
          INSERT INTO category_translations (category_id, locale, name, created_at, updated_at)
          VALUES (#{category_id}, #{connection.quote(locale)}, #{connection.quote(name)}, #{now}, #{now})
        SQL
      end
    end

    connection.execute(<<~SQL.squish)
      UPDATE courses
      SET category_id = (SELECT id FROM categories WHERE slug = 'salsa')
      WHERE slug = 'salsa-basics' AND category_id IS NULL
    SQL
  end
end
