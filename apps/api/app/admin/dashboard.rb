# frozen_string_literal: true

ActiveAdmin.register_page "Dashboard" do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    columns do
      column do
        panel I18n.t("admin.dashboard.content_languages") do
          para I18n.t("admin.dashboard.content_languages_hint")
          ul do
            I18n.available_locales.each do |code|
              li "#{code.upcase} — #{I18n.t("locales.#{code}", locale: code)}"
            end
          end
        end
      end

      column do
        panel I18n.t("admin.dashboard.catalog") do
          ul do
            li "#{I18n.t("admin.dashboard.published_courses")}: #{Course.visible.count}"
            li "#{I18n.t("admin.dashboard.lessons_missing_es")}: #{Lesson.missing_translation("es").count}"
            li "#{I18n.t("admin.dashboard.lessons_missing_en")}: #{Lesson.missing_translation("en").count}"
          end
        end
      end
    end
  end
end
