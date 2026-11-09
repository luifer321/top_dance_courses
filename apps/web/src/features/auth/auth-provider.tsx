"use client";

import { useEffect, type ReactNode } from "react";
import { ensureCsrf } from "@/lib/api";
import { useMe } from "./use-me";

export function AuthProvider({ children }: { children: ReactNode }) {
  useMe();

  useEffect(() => {
    void ensureCsrf();
  }, []);

  return children;
}
