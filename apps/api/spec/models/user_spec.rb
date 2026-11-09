require "rails_helper"

RSpec.describe User, type: :model do
  it "is valid with a strong password" do
    expect(build(:user)).to be_valid
  end

  it "requires passwords of at least 12 characters" do
    user = build(:user, password: "short-pass")
    expect(user).not_to be_valid
    expect(user.errors[:password]).to be_present
  end

  it "allows a Google-only account without a password" do
    user = build(:user, password: nil, encrypted_password: "", skip_password_requirement: true)
    expect(user).to be_valid
    expect(user.has_password?).to be(false)
  end

  it "normalizes email" do
    user = create(:user, email: "  Ana@TopDance.TEST ")
    expect(user.email).to eq("ana@topdance.test")
  end
end
