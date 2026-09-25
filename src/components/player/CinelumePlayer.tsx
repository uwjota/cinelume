"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlayerIframe } from "./PlayerIframe";
import { ServerSelector } from "./ServerSelector";
import { playerRegistry } from "@/services/players/player.service";
import { DEFAULT_PLAYER_SERVER_ID } from "@/services/players/player.service";
import { historyService } from "@/services/storage/history.service";
import { settingsService } from "@/services/storage/settings.service";
import { watchProgressService } from "@/services/storage/watch-progress.service";
import Link from "next/link";
import type { MediaType } from "@/types";

interface CinelumePlayerProps {
  mediaId: string;
  mediaType: MediaType;
  title: string;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  poster?: string;
  durationSeconds?: number;
  nextEpisodeUrl?: string;
  prevEpisodeUrl?: string;
}

export function CinelumePlayer({
  mediaId,
  mediaType,
  title,
  season,
  episode,
  episodeTitle,
  poster,
  durationSeconds,
  nextEpisodeUrl,
  prevEpisodeUrl,
}: CinelumePlayerProps) {
  const sessionStartedAtRef = useRef(Date.now());
  const baseProgressRef = useRef(0);
  const knownDurationRef = useRef(durationSeconds ?? 0);
  const playerLoadedRef = useRef(false);
  const historyRecordedRef = useRef(false);
  const providers = playerRegistry.getAll();
  const fallbackProviderId = providers[0]?.id ?? DEFAULT_PLAYER_SERVER_ID;
  const [activeProviderId, setActiveProviderId] = useState<string | null>(null);
  const [progressReady, setProgressReady] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void settingsService
      .get("defaultPlayerServer", fallbackProviderId)
      .then((savedProviderId) => {
        if (cancelled) return;
        setActiveProviderId(
          playerRegistry.get(savedProviderId) ? savedProviderId : fallbackProviderId
        );
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackProviderId]);

  const getPlaybackUrl = useCallback(() => {
    if (!activeProviderId) return "";
    const provider = playerRegistry.get(activeProviderId);
    if (!provider) return "";

    if (mediaType === "movie" || !season || !episode) {
      return provider.getMovieUrl(mediaId);
    }
    return provider.getEpisodeUrl(mediaId, season, episode);
  }, [activeProviderId, mediaId, mediaType, season, episode]);

  const playbackUrl = getPlaybackUrl();

  useEffect(() => {
    let cancelled = false;
    playerLoadedRef.current = false;
    historyRecordedRef.current = false;
    sessionStartedAtRef.current = Date.now();
    baseProgressRef.current = 0;
    knownDurationRef.current = durationSeconds ?? 0;
    setProgressReady(false);
    setSavedProgress(0);

    void (async () => {
      const saved = await watchProgressService.get(mediaId);
      if (cancelled) return;

      const sameEpisode =
        saved?.season === season && saved?.episode === episode;
      if (saved && sameEpisode) {
        baseProgressRef.current = saved.progress;
        knownDurationRef.current = durationSeconds ?? saved.duration;
        setSavedProgress(saved.progress);
      }
      setProgressReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [durationSeconds, episode, mediaId, season]);

  const persistProgress = useCallback(() => {
    if (!playerLoadedRef.current) return;
    const elapsed = Math.max(
      0,
      Math.floor((Date.now() - sessionStartedAtRef.current) / 1000)
    );
    const duration = knownDurationRef.current;
    const rawProgress = baseProgressRef.current + elapsed;
    const progress = duration > 0 ? Math.min(rawProgress, duration) : rawProgress;

    void watchProgressService.save({
      mediaId,
      mediaType,
      season,
      episode,
      progress,
      duration,
      poster,
      title,
      episodeTitle,
    });
    setSavedProgress(progress);
  }, [episode, episodeTitle, mediaId, mediaType, poster, season, title]);

  useEffect(() => {
    const intervalId = window.setInterval(persistProgress, 15_000);
    const handlePageHide = () => persistProgress();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") persistProgress();
    };

    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      persistProgress();
    };
  }, [persistProgress]);

  const handlePlayerLoad = () => {
    playerLoadedRef.current = true;
    sessionStartedAtRef.current = Date.now();

    if (!historyRecordedRef.current) {
      historyRecordedRef.current = true;
      void historyService.add({
        mediaId,
        mediaType,
        title,
        poster,
        season,
        episode,
        progress: baseProgressRef.current,
        duration: knownDurationRef.current,
      });
      persistProgress();
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 w-full">
      <div className="relative left-1/2 h-[min(52svh,24rem)] min-h-[20rem] w-screen -translate-x-1/2 overflow-hidden border-y border-cine-border bg-black sm:left-auto sm:aspect-video sm:h-auto sm:min-h-0 sm:w-full sm:translate-x-0 sm:border">
        {activeProviderId && progressReady ? (
          <PlayerIframe
            key={playbackUrl}
            url={playbackUrl}
            title={`${title} - ${season ? `T${season}E${episode}` : "Filme"}`}
            onLoad={handlePlayerLoad}
            sandboxed={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-cine-text-muted">
            Carregando vídeo...
          </div>
        )}
      </div>

      {savedProgress > 0 && (
        <p className="px-1 text-xs text-cine-text-muted" aria-live="polite">
          Tempo salvo: {Math.floor(savedProgress / 60)}:
          {String(savedProgress % 60).padStart(2, "0")}
          {season && episode ? ` • T${season} E${episode}` : ""}
        </p>
      )}

      <ServerSelector
        servers={providers.map((provider) => ({
          id: provider.id,
          label: provider.label,
        }))}
        activeServerId={activeProviderId ?? fallbackProviderId}
        onSelectServer={setActiveProviderId}
      />

      {/* Episode Navigation (Only for episodic content) */}
      {(prevEpisodeUrl || nextEpisodeUrl) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {prevEpisodeUrl ? (
            <Link
              href={prevEpisodeUrl}
              aria-label="Episódio anterior"
              className="inline-flex min-h-11 items-center gap-1.5 px-3 py-2 bg-cine-surface hover:bg-cine-surface-elevated border border-cine-border rounded-xl text-xs sm:text-sm font-medium text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Link>
          ) : (
            <div />
          )}

          {nextEpisodeUrl ? (
            <Link
              href={nextEpisodeUrl}
              aria-label="Próximo episódio"
              className="inline-flex min-h-11 items-center gap-1.5 px-3 py-2 bg-cine-brand hover:bg-cine-brand-hover text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-md shadow-cine-brand/20"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
