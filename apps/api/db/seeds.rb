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
end
