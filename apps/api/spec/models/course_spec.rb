# frozen_string_literal: true

require "rails_helper"

RSpec.describe Course, type: :model do
  it "allows ransack on catalog fields" do
    expect(described_class.ransackable_attributes).to include("slug", "status")
    expect(described_class.ransackable_associations).to include("translations")
  end

  it "cannot be published without a published translation title" do
    course = build(:course, status: "published")
    expect(course).not_to be_valid
    expect(course.errors[:status]).to be_present
  end

  it "publishes when a translation is published" do
    course = create(:course, :published)
    expect(course).to be_visible_to_students
  end

  it "does not substitute another language when that translation is unpublished" do
    course = create(:course, :published)
    expect(course.published_translation_for("en")).to be_nil
    expect(course.published_translation_for("es").title).to eq("Salsa básica")
  end

  it "lists courses missing a translation locale" do
    create(:course, :published)
    expect(described_class.missing_translation("en")).to be_present
    expect(described_class.missing_translation("es")).to be_empty
  end
end
