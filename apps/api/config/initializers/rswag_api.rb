Rswag::Api.configure do |c|
  # Must match openapi_root in spec/swagger_helper.rb.
  c.openapi_root = Rails.root.join("swagger").to_s
end
