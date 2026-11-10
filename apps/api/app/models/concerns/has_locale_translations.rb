# frozen_string_literal: true

module HasLocaleTranslations
  extend ActiveSupport::Concern

  included do
    scope :with_published_locale, ->(locale) {
      joins(:translations).where(translations_table_name => { locale: locale, status: "published" })
    }

    scope :missing_translation, lambda { |locale|
      locale = locale.to_s
      if Content::LOCALES.include?(locale)
        fk = reflect_on_association(:translations).foreign_key
        tt = translations_table_name
        where(
          "NOT EXISTS (SELECT 1 FROM #{tt} WHERE #{tt}.#{fk} = #{table_name}.id AND #{tt}.locale = ? AND COALESCE(#{tt}.title, '') <> '')",
          locale
        )
      else
        none
      end
    }
  end

  class_methods do
    def ordered_translations_scope
      -> { in_order_of(:locale, Content::LOCALES) }
    end

    def translations_table_name
      reflect_on_association(:translations).klass.table_name
    end

    def ransackable_scopes(_auth_object = nil)
      extra = const_defined?(:RANSACK_SCOPES) ? self::RANSACK_SCOPES : []
      [ :missing_translation, *extra ].map(&:to_sym).uniq
    end
  end

  def ensure_locale_rows
    Content::LOCALES.each do |locale|
      translations.find_or_initialize_by(locale: locale)
    end
    self
  end

  def translation_for(locale)
    translations.detect { |row| row.locale == locale.to_s }
  end

  def published_in?(locale)
    translation_for(locale)&.published? || false
  end

  def published_translation_for(locale)
    translations.detect { |row| row.locale == locale.to_s && row.published? }
  end

  def any_title
    Content::LOCALES.filter_map { |locale| translation_for(locale)&.try(:title).presence }.first
  end

  def missing_translation_summary
    Content::LOCALES.filter_map do |locale|
      row = translation_for(locale)
      gaps = []
      gaps << "title" if row.nil? || row.title.blank?
      gaps << "description" if row.respond_to?(:description) && (row.nil? || row.description.blank?)
      "#{locale}: #{gaps.join(', ')}" if gaps.any?
    end.join("; ").presence
  end
end
