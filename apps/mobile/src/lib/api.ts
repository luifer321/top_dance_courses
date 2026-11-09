import { createApiClient } from "@top-dance/api-client";

import { config } from "@/config";
import i18n from "@/i18n";

// Bearer tokens (stored in expo-secure-store) will be supplied through
// getAuthHeaders once mobile authentication is implemented.
export const api = createApiClient({
  baseUrl: config.apiUrl,
  credentials: "omit",
  getLocale: () => i18n.language,
});
