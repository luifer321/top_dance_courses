# Picks a supported interface locale (:es or :en) from an explicit parameter
# or an Accept-Language header, falling back to I18n.default_locale.
class LocaleResolver
  def self.call(...) = new.call(...)

  def call(param: nil, accept_language: nil)
    from_param(param) || from_header(accept_language) || I18n.default_locale
  end

  private

  def from_param(value)
    normalize(value)
  end

  # "en-US,en;q=0.9,es;q=0.8" -> first supported language by quality.
  def from_header(header)
    return if header.blank?

    header.split(",")
      .map { |part| part.strip.split(";q=") }
      .each_with_index
      .sort_by { |(_, quality), index| [ -(quality || 1).to_f, index ] }
      .lazy
      .filter_map { |(tag, _), _| normalize(tag) }
      .first
  end

  def normalize(tag)
    code = tag.to_s.strip.downcase.split("-").first
    code&.to_sym if code.present? && I18n.available_locales.include?(code.to_sym)
  end
end
