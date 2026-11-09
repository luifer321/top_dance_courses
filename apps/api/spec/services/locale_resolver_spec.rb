require "rails_helper"

RSpec.describe LocaleResolver do
  it "defaults to Spanish" do
    expect(described_class.call).to eq(:es)
  end

  it "uses a supported param first" do
    expect(described_class.call(param: "en", accept_language: "es")).to eq(:en)
    expect(described_class.call(param: "EN-us")).to eq(:en)
  end

  it "ignores unsupported params" do
    expect(described_class.call(param: "fr", accept_language: "en")).to eq(:en)
  end

  it "picks the highest-quality supported language from Accept-Language" do
    expect(described_class.call(accept_language: "fr-FR,en;q=0.7,es;q=0.9")).to eq(:es)
    expect(described_class.call(accept_language: "en-GB,es")).to eq(:en)
    expect(described_class.call(accept_language: "de,fr")).to eq(:es)
  end
end
