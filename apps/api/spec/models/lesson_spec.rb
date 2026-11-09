# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lesson, type: :model do
  it "exposes previous and next published sibling slugs" do
    course = create(:course, :published)
    mod = create(:course_module, :with_spanish, course: course)
    first = create(:lesson, :published, course_module: mod, slug: "one", position: 0)
    second = create(:lesson, :published, course_module: mod, slug: "two", position: 1)

    expect(first.reload.next_lesson).to eq(second)
    expect(second.reload.previous_lesson).to eq(first)
    expect(first.previous_lesson).to be_nil
  end
end
