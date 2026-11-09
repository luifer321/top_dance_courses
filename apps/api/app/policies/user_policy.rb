# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def show?
    user.present? && user == record
  end

  def update?
    show?
  end
end
