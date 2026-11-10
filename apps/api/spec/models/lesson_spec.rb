# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lesson, type: :model do
  before do
    allow(Bunny).to receive(:configured_for_api?).and_return(false)
  end

  it "keeps one video per language and removes a blank guid" do
    lesson = create_published_catalog_course.lessons.first

    lesson.update!(en_video_guid: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")
    expect(lesson.video_assets.reload.map(&:language)).to contain_exactly("es", "en")

    lesson.update!(en_video_guid: "")
    expect(lesson.video_assets.reload.map(&:language)).to eq([ "es" ])
  end

  it "copies a new lesson slug from the original language" do
    course = create(:course, :published, :with_spanish)
    mod = create(:course_module, course: course)
    lesson = mod.lessons.build(position: 1, duration_seconds: 60)
    lesson.es_slug = "primer-paso"
    lesson.save!

    expect(lesson.slug).to eq("primer-paso")
    expect(lesson.translation_for("es").slug).to eq("primer-paso")
    expect(lesson.en_slug).to be_nil
  end
end
