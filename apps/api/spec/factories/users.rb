FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "student#{n}@topdance.test" }
    name { "Ana Bailarina" }
    password { "a-secure-test-password" }
    password_confirmation { password }
    preferred_locale { "es" }
  end
end
