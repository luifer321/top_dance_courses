require "rails_helper"

RSpec.describe "Admin dashboard", type: :request do
  it "requires authentication" do
    get "/admin"
    expect(response).to redirect_to("/admin/login")
  end

  it "renders the login page in Spanish by default" do
    get "/admin/login"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Top Dance")
    expect(response.body).to include("Contraseña")
  end

  it "switches the admin interface language and remembers it" do
    get "/admin/login", params: { locale: "en" }
    expect(response.body).to include("Password")

    get "/admin/login"
    expect(response.body).to include("Password")
  end

  it "shows the dashboard to signed-in admins" do
    sign_in create(:admin_user)

    get "/admin"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("Idiomas del contenido")
  end

  it "lists admin users" do
    sign_in create(:admin_user)

    get "/admin/admin_users"

    expect(response).to have_http_status(:ok)
  end

  it "lists courses and lessons" do
    sign_in create(:admin_user)
    create_published_catalog_course

    get "/admin/courses"
    expect(response).to have_http_status(:ok)
    expect(response.body).to include("salsa-basics")

    get "/admin/lessons"
    expect(response).to have_http_status(:ok)
    expect(response.body).to include("paso-basico")
  end

  it "renders the course edit form with nested copy" do
    sign_in create(:admin_user)
    course = create_published_catalog_course

    get "/admin/courses/#{course.id}/edit"

    expect(response).to have_http_status(:ok)
    expect(response.body).to include("salsa-basics")
    expect(response.body).to include("Salsa básica")
    expect(response.body).to include("paso-basico")
    expect(response.body).to include("Paso básico")
    expect(response.body).to include("Module titles")
    expect(response.body).to include("Lesson copy")
  end

  it "redirects the root path to the dashboard" do
    get "/"
    expect(response).to redirect_to("/admin")
  end
end
