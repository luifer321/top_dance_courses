import { type User } from "@top-dance/api-client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import i18n from "@/i18n";
import { api, persistSession, refreshSession } from "@/lib/api";
import { apiErrorMessage } from "@/lib/api-error";
import { clearTokens, getAccessToken, getRefreshToken } from "@/lib/session";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | undefined>;
  register: (name: string, email: string, password: string) => Promise<string | undefined>;
  signInWithGoogle: (idToken: string) => Promise<string | undefined>;
  requestPasswordReset: (email: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
  reload: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function fallbackError() {
  return i18n.t("errors.generic");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const access = await getAccessToken();
    if (!access) {
      setUser(null);
      return;
    }
    const { data, response } = await api.GET("/api/v1/me");
    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (!refreshed) {
        setUser(null);
        return;
      }
      const retry = await api.GET("/api/v1/me");
      setUser(retry.data ?? null);
      return;
    }
    setUser(data ?? null);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await loadUser();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      reload: loadUser,
      signIn: async (email, password) => {
        const { data, error } = await api.POST("/api/v1/auth/login", { body: { email, password } });
        if (error || !data) return apiErrorMessage(error, fallbackError());
        await persistSession(data);
        setUser(data.user);
      },
      register: async (name, email, password) => {
        const { data, error } = await api.POST("/api/v1/auth/register", { body: { name, email, password } });
        if (error || !data) return apiErrorMessage(error, fallbackError());
        await persistSession(data);
        setUser(data.user);
      },
      signInWithGoogle: async (idToken) => {
        const { data, error } = await api.POST("/api/v1/auth/google", { body: { id_token: idToken } });
        if (error || !data) return apiErrorMessage(error, fallbackError());
        await persistSession(data);
        setUser(data.user);
      },
      requestPasswordReset: async (email) => {
        const { error } = await api.POST("/api/v1/auth/password", { body: { email } });
        if (error) return apiErrorMessage(error, fallbackError());
      },
      signOut: async () => {
        const refreshToken = await getRefreshToken();
        await api.DELETE("/api/v1/auth/session", { body: { refresh_token: refreshToken ?? undefined } });
        await clearTokens();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
