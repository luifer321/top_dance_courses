module Api
  module V1
    # Readiness check: the app booted and the primary database answers.
    # Public and unauthenticated; exposes no configuration details.
    class HealthController < BaseController
      def show
        database_ok = database_reachable?

        render json: { status: database_ok ? "ok" : "degraded", database: database_ok ? "ok" : "unavailable" },
               status: database_ok ? :ok : :service_unavailable
      end

      private

      def database_reachable?
        ActiveRecord::Base.connection.select_value("SELECT 1") == 1
      rescue ActiveRecord::ActiveRecordError
        false
      end
    end
  end
end
