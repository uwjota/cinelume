import { tmdbMetadataProvider } from "@/providers/metadata/tmdb.provider";
import { reiDosEmbedsLiveTvProvider } from "@/providers/live-tv/reidosembeds.provider";
import { reiDosEmbedsEventsProvider } from "@/providers/events/reidosembeds.events";
import type { Media, LiveChannel, LiveEvent } from "@/types";

export interface UnifiedSearchResult {
  media: Media[];
  channels: LiveChannel[];
  events: LiveEvent[];
  mediaPage: number;
  mediaTotalPages: number;
  mediaTotalResults: number;
}

export class CinelumeSearchService {
  /**
   * Performs unified search across movies, series, channels, and sports events.
   */
  async searchAll(query: string, page = 1): Promise<UnifiedSearchResult> {
    const trimmed = query.trim();
    if (!trimmed) {
      return {
        media: [],
        channels: [],
        events: [],
        mediaPage: 1,
        mediaTotalPages: 1,
        mediaTotalResults: 0,
      };
    }

    const mediaResult = await tmdbMetadataProvider.search(trimmed, page);
    const [channelsResult, eventsResult] =
      page === 1
        ? await Promise.allSettled([
            reiDosEmbedsLiveTvProvider.getChannels(),
            reiDosEmbedsEventsProvider.getEvents(),
          ])
        : [
            { status: "fulfilled", value: [] } as const,
            { status: "fulfilled", value: [] } as const,
          ];

    const allChannels =
      channelsResult.status === "fulfilled" ? channelsResult.value : [];
    const allEvents =
      eventsResult.status === "fulfilled" ? eventsResult.value : [];

    const qLower = trimmed.toLowerCase();
    const channels = allChannels.filter(
      (ch) =>
        ch.name.toLowerCase().includes(qLower) ||
        ch.category?.toLowerCase().includes(qLower) ||
        ch.nowPlaying?.toLowerCase().includes(qLower)
    );

    const events = allEvents.filter(
      (ev) =>
        ev.title.toLowerCase().includes(qLower) ||
        ev.sport?.toLowerCase().includes(qLower) ||
        ev.competition?.toLowerCase().includes(qLower)
    );

    return {
      media: mediaResult.items,
      channels,
      events,
      mediaPage: mediaResult.page,
      mediaTotalPages: mediaResult.totalPages,
      mediaTotalResults: mediaResult.totalResults,
    };
  }
}

export const searchService = new CinelumeSearchService();
