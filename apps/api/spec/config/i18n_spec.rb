require "rails_helper"

RSpec.describe "Internationalization configuration" do
  def flat_keys(hash, prefix = nil)
    hash.flat_map do |key, value|
      path = [ prefix, key ].compact.join(".")
      value.is_a?(Hash) ? flat_keys(value, path) : [ path ]
    end
  end

  it "supports Spanish (default) and English" do
    expect(I18n.available_locales).to eq(%i[es en])
    expect(I18n.default_locale).to eq(:es)
  end

  it "keeps application translation files in sync" do
    es = YAML.load_file(Rails.root.join("config/locales/es.yml"))["es"]
    en = YAML.load_file(Rails.root.join("config/locales/en.yml"))["en"]

    expect(flat_keys(en).sort).to eq(flat_keys(es).sort)
  end

  it "has Devise and ActiveAdmin translations for every locale" do
    I18n.available_locales.each do |locale|
      expect(I18n.t("devise.sessions.signed_in", locale: locale, raise: true)).to be_present
      expect(I18n.t("active_admin.dashboard", locale: locale, raise: true)).to be_present
    end
  end
end
