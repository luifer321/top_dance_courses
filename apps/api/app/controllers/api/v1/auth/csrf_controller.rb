# frozen_string_literal: true

module Api
  module V1
    module Auth
      class CsrfController < BaseController
        def show
          render json: { csrf_token: form_authenticity_token }
        end
      end
    end
  end
end
