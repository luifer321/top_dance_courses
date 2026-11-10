# frozen_string_literal: true

# One public slug per language, edited as es_slug and en_slug.
# The record slug stays as the stable id so older links keep resolving.
module LocaleSlugFields
  extend ActiveSupport::Concern

  included do
    Content::LOCALES.each do |locale|
      define_method("#{locale}_slug") { locale_slug_value(locale) }
      define_method("#{locale}_slug=") { |value| assign_locale_slug(locale, value) }
    end

    before_validation :assign_stable_slug
  end

  def locale_slug_value(locale)
    translation_for(locale)&.slug.presence || stable_slug_for(locale)
  end

  def public_slug(locale)
    row = translation_for(locale)
    return slug unless row&.published?

    row.slug.presence || slug
  end

  def localized_slugs
    translations.select(&:published?).each_with_object({}) do |row, map|
      map[row.locale] = row.slug.presence || slug
    end
  end

  private

  def assign_locale_slug(locale, value)
    ensure_locale_rows
    translation_for(locale).slug = value
  end

  # A published translation with no slug of its own keeps the stable record slug.
  def stable_slug_for(locale)
    return unless persisted?
    return unless translation_for(locale)&.published?

    slug
  end

  def assign_stable_slug
    return if slug.present?

    source = Content::LOCALES.filter_map { |locale| translation_for(locale)&.slug.presence }.first
    self.slug = source if source.present?
  end
end
