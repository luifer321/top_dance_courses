require "rails_helper"

RSpec.describe RefreshToken, type: :model do
  let(:user) { create(:user) }

  it "issues a digest-only token and rotates it" do
    raw = described_class.issue!(user)
    expect(described_class.find_by(token_digest: described_class.digest(raw))).to be_present

    redeemed_user, next_raw = described_class.redeem!(raw)
    expect(redeemed_user).to eq(user)
    expect(next_raw).not_to eq(raw)
    expect(described_class.redeem!(raw)).to be_nil
  end

  it "revokes the whole family when a rotated token is reused" do
    first = described_class.issue!(user)
    _user, second = described_class.redeem!(first)
    expect(described_class.redeem!(first)).to be_nil
    expect(described_class.redeem!(second)).to be_nil
  end
end
