require "rails_helper"

RSpec.describe Auth::GoogleAuthenticator do
  def payload(overrides = {})
    {
      "sub" => "google-sub-1",
      "email" => "ana@gmail.com",
      "email_verified" => true,
      "name" => "Ana G"
    }.merge(overrides)
  end

  before do
    ENV["GOOGLE_OAUTH_CLIENT_IDS"] = "test-client.apps.googleusercontent.com"
    allow(Google::Auth::IDTokens).to receive(:verify_oidc).and_return(payload)
  end

  after { ENV.delete("GOOGLE_OAUTH_CLIENT_IDS") }

  it "creates a user when the email is new" do
    user = described_class.call(id_token: "token", locale: :es)
    expect(user.email).to eq("ana@gmail.com")
    expect(user.email_verified_at).to be_present
    expect(user.has_password?).to be(false)
    expect(user.identities.find_by(provider: "google").uid).to eq("google-sub-1")
  end

  it "signs in an existing Google subject" do
    existing = described_class.call(id_token: "token", locale: :es)
    again = described_class.call(id_token: "token", locale: :en)
    expect(again).to eq(existing)
    expect(User.count).to eq(1)
  end

  it "takes over an unverified password signup" do
    squatter = create(:user, email: "ana@gmail.com")
    expect(squatter.has_password?).to be(true)

    user = described_class.call(id_token: "token", locale: :es)
    expect(user).to eq(squatter)
    expect(user.reload.has_password?).to be(false)
    expect(user.email_verified_at).to be_present
    expect(user.identities.find_by(provider: "google").uid).to eq("google-sub-1")
  end

  it "rejects a Google subject that does not match a verified account" do
    verified = create(:user, email: "ana@gmail.com", email_verified_at: Time.current)
    create(:user_identity, user: verified, uid: "other-sub")

    expect {
      described_class.call(id_token: "token", locale: :es)
    }.to raise_error(Auth::GoogleAccountConflict)
  end

  it "raises when Google client ids are missing" do
    ENV["GOOGLE_OAUTH_CLIENT_IDS"] = ""
    expect {
      described_class.call(id_token: "token", locale: :es)
    }.to raise_error(Auth::GoogleUnavailable)
  end
end
