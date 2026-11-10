"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { api, ensureCsrf } from "@/lib/api";

type PlayerJs = {
  Player: new (iframe: HTMLIFrameElement) => {
    on: (event: string, callback: (data?: { seconds: number; duration: number }) => void) => void;
  };
};

declare global {
  interface Window {
    playerjs?: PlayerJs;
  }
}

const PLAYER_SRC = "https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js";
const REPORT_EVERY_SECONDS = 15;

function loadPlayerJs() {
  if (window.playerjs) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-bunny-playerjs]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("playerjs")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = PLAYER_SRC;
    script.dataset.bunnyPlayerjs = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("playerjs"));
    document.head.appendChild(script);
  });
}

// A lesson counts as watched once the player reaches 90% or fires ended.
// The API keeps the furthest position, so rewinding does not erase progress.
export function useWatchProgress(iframe: HTMLIFrameElement | null, slug: string | undefined, lessonSlug: string | undefined, enabled: boolean) {
  const queryClient = useQueryClient();
  const lastSent = useRef(0);

  useEffect(() => {
    if (!enabled || !iframe || !slug || !lessonSlug) return;
    let cancelled = false;

    const send = async (seconds: number, duration: number, ended: boolean) => {
      if (cancelled) return;
      if (!ended && seconds - lastSent.current < REPORT_EVERY_SECONDS && seconds < duration * 0.9) return;
      lastSent.current = seconds;
      try {
        await ensureCsrf();
        await api.POST("/api/v1/courses/{slug}/lessons/{lesson_slug}/progress", {
          params: { path: { slug, lesson_slug: lessonSlug } },
          body: {
            position_seconds: Math.floor(seconds),
            duration_seconds: Math.floor(duration),
            ended,
          },
        });
        await queryClient.invalidateQueries({ queryKey: ["courses"] });
        await queryClient.invalidateQueries({ queryKey: ["course", slug] });
      } catch {
        // Playback continues even if progress cannot be saved.
      }
    };

    void loadPlayerJs()
      .then(() => {
        if (cancelled || !window.playerjs) return;
        const player = new window.playerjs.Player(iframe);
        player.on("ready", () => {
          player.on("timeupdate", (data) => {
            if (!data) return;
            void send(data.seconds, data.duration, false);
          });
          player.on("ended", (data) => {
            const duration = data?.duration ?? data?.seconds ?? 0;
            void send(duration, duration, true);
          });
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [enabled, iframe, lessonSlug, queryClient, slug]);
}
