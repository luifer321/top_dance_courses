"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { apiErrorMessage } from "@/lib/api-error";
import { api, ensureCsrf } from "@/lib/api";
import { useInvalidateMe } from "./use-me";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

export function GoogleSignInButton() {
  const t = useTranslations("auth");
  const tErrors = useTranslations("errors");
  const router = useRouter();
  const invalidateMe = useInvalidateMe();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    let cancelled = false;
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT}"]`);

    function start() {
      if (cancelled || !containerRef.current || !window.google || !clientId) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          await ensureCsrf();
          const { error } = await api.POST("/api/v1/auth/google", { body: { id_token: credential } });
          if (error) {
            toast.error(apiErrorMessage(error, tErrors("generic")));
            return;
          }
          await ensureCsrf();
          await invalidateMe();
          router.replace("/dashboard");
        },
      });
      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "filled_black",
        size: "large",
        width: 320,
        text: "continue_with",
      });
      setReady(true);
    }

    if (existing) {
      start();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.onload = start;
    document.head.appendChild(script);
    return () => {
      cancelled = true;
    };
  }, [clientId, invalidateMe, router, tErrors]);

  if (!clientId) {
    return <p className="text-center text-sm text-muted-foreground">{t("googleUnavailable")}</p>;
  }

  return (
    <div className="flex min-h-10 justify-center">
      <div ref={containerRef} className={ready ? "w-full" : "sr-only"} />
    </div>
  );
}
