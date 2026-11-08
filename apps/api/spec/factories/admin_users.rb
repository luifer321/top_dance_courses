FactoryBot.define do
  factory :admin_user do
    sequence(:email) { |n| "admin#{n}@topdance.test" }
    password { "a-secure-test-password" }
    password_confirmation { password }
  end
end
