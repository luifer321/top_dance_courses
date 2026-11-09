require "rails_helper"

RSpec.describe AdminUser, type: :model do
  it "is valid with a strong password" do
    expect(build(:admin_user)).to be_valid
  end

  it "requires passwords of at least 12 characters" do
    admin = build(:admin_user, password: "short-pass")
    expect(admin).not_to be_valid
    expect(admin.errors[:password]).to be_present
  end

  it "allowlists searchable attributes and no associations for Ransack" do
    expect(described_class.ransackable_attributes).to eq(%w[id email created_at updated_at])
    expect(described_class.ransackable_associations).to eq([])
  end
end
