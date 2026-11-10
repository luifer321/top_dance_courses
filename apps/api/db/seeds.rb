# Idempotent seeds. Production admins are created manually (see README),
# never with default credentials.
if Rails.env.development?
  email = ENV.fetch("DEV_ADMIN_EMAIL", "admin@topdance.local")
  password = ENV.fetch("DEV_ADMIN_PASSWORD", "topdance-dev-password")

  AdminUser.find_or_create_by!(email: email) do |admin|
    admin.password = password
    admin.password_confirmation = password
  end
  puts "Development admin: #{email}"

  [
    [ "salsa", 0, "Salsa", "Salsa" ],
    [ "bachata", 1, "Bachata", "Bachata" ],
    [ "urban", 2, "Urbano", "Urban" ],
    [ "champeta", 3, "Champeta", "Champeta" ]
  ].each do |slug, position, spanish, english|
    category = Category.find_or_create_by!(slug: slug) { |row| row.position = position }
    category.update!(position: position)
    { "es" => spanish, "en" => english }.each do |locale, name|
      translation = category.translations.find_or_initialize_by(locale: locale)
      translation.update!(name: name)
    end
  end

  salsa = Category.find_by!(slug: "salsa")
  Course.where(slug: "salsa-basics", category_id: nil).update_all(category_id: salsa.id)

  course = Course.find_by(slug: "salsa-basics")
  if course
    course.update!(cover_image_url: "/catalog/salsa-basics.svg") if course.cover_image_url.blank?
    lesson = course.lessons.find_by(slug: "paso-basico")
    if lesson
      lesson.update!(thumbnail_url: "/catalog/paso-basico.svg") if lesson.thumbnail_url.blank?
      spanish = lesson.translation_for("es")
      if spanish && spanish.subtitle.blank?
        spanish.update!(subtitle: "Técnica, peso y ritmo del primer paso.")
      end
    end
  end
end
