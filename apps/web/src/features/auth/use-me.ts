"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { api } from "@/lib/api";

export const meQueryKey = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: async () => {
      const { data, response } = await api.GET("/api/v1/me");
      if (response.status === 401) return null;
      return data ?? null;
    },
    retry: false,
  });
}

export function useInvalidateMe() {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.invalidateQueries({ queryKey: meQueryKey }), [queryClient]);
}
