"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/features/auth/auth-provider";
import { LocaleAlternateProvider } from "@/features/i18n/locale-alternates";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { makeQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LocaleAlternateProvider>
            {children}
            <Toaster />
          </LocaleAlternateProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
