# frozen_string_literal: true

FactoryBot.define do
  factory :course do
    sequence(:slug) { |n| "salsa-basics-#{n}" }
    original_language { "es" }
    level { "beginner" }
    status { "draft" }

    trait :published do
      status { "published" }
      published_at { Time.current }

      after(:build) do |course|
        translation = course.translations.detect { |row| row.locale == course.original_language }
        if translation
          translation.status = "published"
          translation.title = "Salsa básica" if translation.title.blank?
        else
          course.translations << build(:course_translation, :published, course: course, locale: course.original_language)
        end
      end
    end

    trait :with_spanish do
      after(:build) do |course|
        course.translations << build(:course_translation, :published, course: course, locale: "es") unless course.translation_for("es")
      end
    end
  end

  factory :course_translation do
    course
    locale { "es" }
    title { "Salsa básica" }
    description { "Aprende el paso básico." }
    status { "draft" }

    trait :published do
      status { "published" }
    end
  end

  factory :course_module do
    course
    position { 0 }

    trait :with_spanish do
      after(:build) do |mod|
        mod.translations << build(:course_module_translation, :published, course_module: mod) unless mod.translation_for("es")
      end
    end
  end

  factory :course_module_translation do
    course_module
    locale { "es" }
    title { "Fundamentos" }
    status { "draft" }

    trait :published do
      status { "published" }
    end
  end

  factory :lesson do
    course_module
    sequence(:slug) { |n| "paso-basico-#{n}" }
    position { 0 }
    duration_seconds { 180 }

    trait :published do
      after(:build) do |lesson|
        locale = lesson.course&.original_language || "es"
        translation = lesson.translations.detect { |row| row.locale == locale }
        if translation
          translation.status = "published"
          translation.title = "Paso básico" if translation.title.blank?
        else
          lesson.translations << build(:lesson_translation, :published, lesson: lesson, locale: locale)
        end
      end
    end
  end

  factory :lesson_translation do
    lesson
    locale { "es" }
    title { "Paso básico" }
    description { "El primer paso." }
    status { "draft" }

    trait :published do
      status { "published" }
    end
  end

  factory :video_asset do
    lesson
    language { "es" }
    kind { "original" }
    provider { "bunny" }
    provider_video_id { "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" }
    status { "processing" }

    trait :ready do
      status { "ready" }
    end
  end

  factory :subtitle_track do
    video_asset
    language { "en" }
  end
end
