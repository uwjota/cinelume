import { tmdbMetadataProvider } from "@/providers/metadata/tmdb.provider";
import type { Media } from "@/types";
import type { CatalogMediaType, CatalogSort } from "@/config/catalog-filters";
import type { MediaCatalogPage } from "@/providers/metadata/tmdb.provider";

export class CinelumeCatalogService {
  /**
   * Fetches trending items across all formats.
   */
  async getTrending(page = 1): Promise<Media[]> {
    return tmdbMetadataProvider.getTrending(page);
  }

  /**
   * Fetches popular movies.
   */
  async getPopularMovies(page = 1): Promise<Media[]> {
    return tmdbMetadataProvider.getPopularMovies(page);
  }

  /**
   * Fetches popular series.
   */
  async getPopularSeries(page = 1): Promise<Media[]> {
    return tmdbMetadataProvider.getPopularSeries(page);
  }

  /**
   * Fetches popular animes.
   */
  async getPopularAnimes(page = 1): Promise<Media[]> {
    return tmdbMetadataProvider.getPopularAnimes(page);
  }

  /**
   * Fetches popular doramas.
   */
  async getPopularDoramas(page = 1): Promise<Media[]> {
    return tmdbMetadataProvider.getPopularDoramas(page);
  }

  /**
   * Fetches newly released movies.
   */
  async getNewReleases(page = 1): Promise<Media[]> {
    return tmdbMetadataProvider.getNewReleases(page);
  }

  async getCatalog(
    type: CatalogMediaType,
    page = 1,
    genreId?: number,
    sort: CatalogSort = "popularity"
  ): Promise<MediaCatalogPage> {
    return tmdbMetadataProvider.getCatalog(type, page, genreId, sort);
  }
}

export const catalogService = new CinelumeCatalogService();
