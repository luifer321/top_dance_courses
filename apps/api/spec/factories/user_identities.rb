FactoryBot.define do
  factory :user_identity do
    user
    provider { "google" }
    sequence(:uid) { |n| "google-sub-#{n}" }
  end
end
