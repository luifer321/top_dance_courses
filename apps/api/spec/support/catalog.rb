# frozen_string_literal: true

module CatalogSpecHelper
  def create_published_catalog_course(slug: "salsa-basics", lesson_slug: "paso-basico", video_status: "ready")
    course = create(:course, :published, slug: slug, cover_image_url: "/catalog/salsa-basics.svg")
    mod = create(:course_module, :with_spanish, course: course)
    lesson = create(:lesson, :published, course_module: mod, slug: lesson_slug, thumbnail_url: "/catalog/paso-basico.svg")
    create(:video_asset, lesson: lesson, status: video_status, language: "es", kind: "original")
    course.reload
  end
end

RSpec.configure do |config|
  config.include CatalogSpecHelper
end
