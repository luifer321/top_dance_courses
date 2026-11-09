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

  it "redirects the root path to the dashboard" do
    get "/"
    expect(response).to redirect_to("/admin")
  end
end
