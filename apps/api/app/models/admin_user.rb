# Staff accounts for the /admin dashboard. Kept separate from future student
# User accounts so admin access can never be granted through the public API.
class AdminUser < ApplicationRecord
  devise :database_authenticatable, :recoverable, :rememberable, :validatable, :timeoutable

  def self.ransackable_attributes(_auth_object = nil)
    %w[id email created_at updated_at]
  end

  def self.ransackable_associations(_auth_object = nil)
    []
  end
end
