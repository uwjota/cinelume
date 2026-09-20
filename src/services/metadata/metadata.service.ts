import { tmdbMetadataProvider } from "@/providers/metadata/tmdb.provider";
import type { MediaDetails, Episode, MediaType } from "@/types";

export class CinelumeMetadataService {
  /**
   * Fetches full details for a media item.
   */
  async getDetails(id: string, type: MediaType): Promise<MediaDetails | null> {
    return tmdbMetadataProvider.getMediaDetails(id, type);
  }

  /**
   * Fetches episodes for a specific series and season.
   */
  async getEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    return tmdbMetadataProvider.getSeasonEpisodes(seriesId, seasonNumber);
  }
}

export const metadataService = new CinelumeMetadataService();
