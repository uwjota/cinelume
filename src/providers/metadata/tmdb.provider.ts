import { PROVIDER_CONFIG } from "@/config/providers";
import { safeFetchJson } from "@/lib/http/client";
import {
  TmdbMovieItemSchema,
  TmdbTvItemSchema,
  TmdbPaginatedResponseSchema,
  TmdbSeasonSchema,
} from "@/lib/validation/schemas";
import { toMediaModel } from "@/adapters/media.adapter";
import type { Media, MediaDetails, Season, Episode, Person } from "@/types";
import type { CatalogMediaType, CatalogSort } from "@/config/catalog-filters";
import {
  heroItems,
  trendingMovies,
  popularSeries,
  popularAnimes,
  popularDoramas,
  newReleases,
} from "@/lib/mock-data";

export interface MediaSearchPage {
  items: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface MediaCatalogPage {
  items: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export class TmdbMetadataProvider {
  private baseUrl = PROVIDER_CONFIG.tmdb.apiBaseUrl;
  private apiKey = PROVIDER_CONFIG.tmdb.apiKey;
  private accessToken = PROVIDER_CONFIG.tmdb.accessToken;
  private timeoutMs = PROVIDER_CONFIG.timeouts.metadata;

  private isConfigured(): boolean {
    return Boolean(this.apiKey.trim() || this.accessToken.trim());
  }

  private buildUrl(path: string, params: Record<string, string> = {}): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (this.apiKey.trim()) url.searchParams.set("api_key", this.apiKey);
    url.searchParams.set("language", "pt-BR");
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  }

  private requestOptions(revalidate?: number) {
    return {
      timeoutMs: this.timeoutMs,
      headers: this.accessToken.trim()
        ? { Authorization: `Bearer ${this.accessToken}` }
        : undefined,
      ...(revalidate ? { next: { revalidate } } : {}),
    };
  }

  private fallback(items: Media[], page = 1): Media[] {
    if (page > 1) return [];
    return items.map((item) => ({
      ...item,
      id: String(item.tmdbId ?? item.id),
    }));
  }

  private fallbackDetails(
    id: string,
    type: "movie" | "series" | "anime" | "dorama"
  ): MediaDetails | null {
    const match = [
      ...heroItems,
      ...trendingMovies,
      ...popularSeries,
      ...popularAnimes,
      ...popularDoramas,
      ...newReleases,
    ].find(
      (media) =>
        media.type === type &&
        (media.id === id || String(media.tmdbId) === id)
    );

    if (!match) return null;

    return {
      ...match,
      id: String(match.tmdbId ?? match.id),
      type,
      runtime: type === "movie" ? 120 : undefined,
      cast: [
        { id: "1", name: "Ator Principal", character: "Protagonista" },
        { id: "2", name: "Ator Coadjuvante", character: "Aliado" },
      ],
      seasons:
        type !== "movie"
          ? [
              { number: 1, name: "Temporada 1", episodeCount: 8 },
              { number: 2, name: "Temporada 2", episodeCount: 8 },
            ]
          : undefined,
    };
  }

  private fallbackEpisodes(seriesId: string, seasonNumber: number): Episode[] {
    return [
      {
        id: `${seriesId}-s${seasonNumber}-e1`,
        number: 1,
        seasonNumber,
        title: "Episódio 1",
        overview: "Início da temporada e apresentação dos conflitos.",
        runtime: 45,
      },
      {
        id: `${seriesId}-s${seasonNumber}-e2`,
        number: 2,
        seasonNumber,
        title: "Episódio 2",
        overview: "O enredo se aprofunda e os desafios aumentam.",
        runtime: 50,
      },
    ];
  }

  /**
   * Fetches trending media items across movies and TV shows.
   */
  async getTrending(page = 1): Promise<Media[]> {
    if (!this.isConfigured()) return this.fallback(trendingMovies, page);

    const url = this.buildUrl("/trending/all/week", { page: String(page) });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) return this.fallback(trendingMovies, page);

    return result.data.results
      .map((item) => toMediaModel(item as Record<string, unknown>));
  }

  /**
   * Fetches popular movies.
   */
  async getPopularMovies(page = 1): Promise<Media[]> {
    if (!this.isConfigured()) return this.fallback(trendingMovies, page);

    const url = this.buildUrl("/movie/popular", { page: String(page) });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) return this.fallback(trendingMovies, page);

    return result.data.results
      .map((item) => toMediaModel({ ...(item as Record<string, unknown>), type: "movie" }));
  }

  /**
   * Fetches popular series.
   */
  async getPopularSeries(page = 1): Promise<Media[]> {
    if (!this.isConfigured()) return this.fallback(popularSeries, page);

    const url = this.buildUrl("/tv/popular", { page: String(page) });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) return this.fallback(popularSeries, page);

    return result.data.results
      .map((item) => toMediaModel({ ...(item as Record<string, unknown>), type: "series" }));
  }

  /** Fetches one page of a catalog, optionally constrained by genre. */
  async getCatalog(
    type: CatalogMediaType,
    page = 1,
    genreId?: number,
    sort: CatalogSort = "popularity"
  ): Promise<MediaCatalogPage> {
    const normalizedPage = Math.max(1, Math.min(page, 500));
    const fallbackItems =
      type === "movie"
        ? trendingMovies
        : type === "anime"
          ? popularAnimes
          : type === "dorama"
            ? popularDoramas
            : popularSeries;

    if (!this.isConfigured()) {
      const items = this.fallback(fallbackItems, normalizedPage);
      return { items, page: normalizedPage, totalPages: 1, totalResults: items.length };
    }

    const sortBy: Record<CatalogSort, string> = {
      popularity: "popularity.desc",
      rating: "vote_average.desc",
      year:
        type === "movie" ? "primary_release_date.desc" : "first_air_date.desc",
      title: type === "movie" ? "title.asc" : "name.asc",
    };
    const params: Record<string, string> = {
      page: String(normalizedPage),
      sort_by: sortBy[sort],
    };
    if (type === "anime") {
      params.with_origin_country = "JP";
      params.with_genres = genreId && genreId !== 16 ? `16,${genreId}` : "16";
    } else if (type === "dorama") {
      params.with_origin_country = "KR";
      if (genreId) params.with_genres = String(genreId);
    } else if (genreId) {
      params.with_genres = String(genreId);
    }

    const url = this.buildUrl(
      type === "movie" ? "/discover/movie" : "/discover/tv",
      params
    );
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) {
      return { items: [], page: normalizedPage, totalPages: 1, totalResults: 0 };
    }

    return {
      items: result.data.results.map((item) =>
        toMediaModel({
          ...(item as Record<string, unknown>),
          type,
        })
      ),
      page: result.data.page,
      totalPages: Math.min(result.data.total_pages, 500),
      totalResults: result.data.total_results,
    };
  }

  /**
   * Fetches popular animes (Animation from Japan).
   */
  async getPopularAnimes(page = 1): Promise<Media[]> {
    if (!this.isConfigured()) return this.fallback(popularAnimes, page);

    const url = this.buildUrl("/discover/tv", {
      with_genres: "16",
      with_origin_country: "JP",
      sort_by: "popularity.desc",
      page: String(page),
    });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) return this.fallback(popularAnimes, page);

    return result.data.results
      .map((item) => toMediaModel({ ...(item as Record<string, unknown>), type: "anime" }));
  }

  /**
   * Fetches popular doramas (Drama from South Korea).
   */
  async getPopularDoramas(page = 1): Promise<Media[]> {
    if (!this.isConfigured()) return this.fallback(popularDoramas, page);

    const url = this.buildUrl("/discover/tv", {
      with_genres: "18",
      with_origin_country: "KR",
      sort_by: "popularity.desc",
      page: String(page),
    });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) return this.fallback(popularDoramas, page);

    return result.data.results
      .map((item) => toMediaModel({ ...(item as Record<string, unknown>), type: "dorama" }));
  }

  /**
   * Fetches new movie releases.
   */
  async getNewReleases(page = 1): Promise<Media[]> {
    if (!this.isConfigured()) return this.fallback(newReleases, page);

    const url = this.buildUrl("/movie/now_playing", { page: String(page) });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(3600),
    });

    if (result.error || !result.data?.results) return this.fallback(newReleases, page);

    return result.data.results
      .map((item) => toMediaModel({ ...(item as Record<string, unknown>), type: "movie" }));
  }

  /**
   * Fetches full details for a movie or series by ID.
   */
  async getMediaDetails(id: string, type: "movie" | "series" | "anime" | "dorama"): Promise<MediaDetails | null> {
    const isMovie = type === "movie";
    const path = isMovie ? `/movie/${id}` : `/tv/${id}`;

    if (!this.isConfigured()) return this.fallbackDetails(id, type);

    const url = this.buildUrl(path, { append_to_response: "credits,recommendations,videos" });
    const schema = isMovie ? TmdbMovieItemSchema : TmdbTvItemSchema;
    const result = await safeFetchJson(url, schema, this.requestOptions());

    if (result.error || !result.data) {
      return this.fallbackDetails(id, type);
    }

    const baseMedia = toMediaModel({
      ...(result.data as Record<string, unknown>),
      type,
    });

    const rawData = result.data as Record<string, unknown>;
    const credits = rawData.credits as {
      cast?: Array<Record<string, unknown>>;
      crew?: Array<Record<string, unknown>>;
    } | undefined;
    const cast: Person[] =
      credits?.cast?.slice(0, 10).map((c) => ({
        id: String(c.id),
        name: String(c.name || "Ator"),
        character: c.character ? String(c.character) : undefined,
        profilePath: c.profile_path
          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
          : undefined,
      })) || [];

    const seasons: Season[] = isMovie
      ? []
      : ((rawData.seasons as Array<Record<string, unknown>>) || [])
          .filter((season) => Number(season.season_number) > 0)
          .map((s) => ({
            number: Number(s.season_number || 1),
            name: String(s.name || `Temporada ${s.season_number}`),
            episodeCount: Number(s.episode_count || 0),
            poster: s.poster_path
              ? `https://image.tmdb.org/t/p/w300${s.poster_path}`
              : undefined,
            overview: s.overview ? String(s.overview) : undefined,
          }));

    const directors: Person[] =
      credits?.crew
        ?.filter((person) => person.job === "Director")
        .slice(0, 5)
        .map((person) => ({
          id: String(person.id),
          name: String(person.name || "Diretor"),
          profilePath: person.profile_path
            ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
            : undefined,
        })) ?? [];

    const recommendationPayload = rawData.recommendations as
      | { results?: Array<Record<string, unknown>> }
      | undefined;
    const recommendations = (recommendationPayload?.results ?? [])
      .slice(0, 16)
      .map((item) => toMediaModel({ ...item, type }));

    const episodeRunTime = rawData.episode_run_time as number[] | undefined;
    const videosPayload = rawData.videos as
      | { results?: Array<Record<string, unknown>> }
      | undefined;
    const trailerVideo = (videosPayload?.results ?? []).find(
      (video) => video.site === "YouTube" && video.type === "Trailer" && video.key
    );

    return {
      ...baseMedia,
      runtime: isMovie
        ? (rawData.runtime as number) || undefined
        : episodeRunTime?.[0],
      cast,
      directors,
      seasons: seasons.length > 0 ? seasons : undefined,
      recommendations,
      trailer: trailerVideo?.key
        ? `https://www.youtube.com/watch?v=${String(trailerVideo.key)}`
        : undefined,
    };
  }

  /**
   * Fetches episodes for a given series and season number.
   */
  async getSeasonEpisodes(seriesId: string, seasonNumber: number): Promise<Episode[]> {
    if (!this.isConfigured()) return this.fallbackEpisodes(seriesId, seasonNumber);

    const url = this.buildUrl(`/tv/${seriesId}/season/${seasonNumber}`);
    const result = await safeFetchJson(url, TmdbSeasonSchema, this.requestOptions());

    if (result.error || !result.data?.episodes) {
      return this.fallbackEpisodes(seriesId, seasonNumber);
    }

    return result.data.episodes.map((ep) => ({
      id: String(ep.id),
      number: ep.episode_number,
      seasonNumber: ep.season_number,
      title: ep.name,
      overview: ep.overview,
      thumbnail: ep.still_path
        ? `https://image.tmdb.org/t/p/w500${ep.still_path}`
        : undefined,
      runtime: ep.runtime || undefined,
      airDate: ep.air_date || undefined,
    }));
  }

  /**
   * Unified multi-search across movies and TV.
   */
  async search(query: string, page = 1): Promise<MediaSearchPage> {
    const normalizedPage = Math.max(1, Math.min(page, 500));
    if (!query.trim()) {
      return { items: [], page: normalizedPage, totalPages: 1, totalResults: 0 };
    }

    if (!this.isConfigured()) {
      const allMocks = [
        ...trendingMovies,
        ...popularSeries,
        ...popularAnimes,
        ...popularDoramas,
        ...newReleases,
      ];
      const q = query.toLowerCase();
      const items = this.fallback(
        allMocks.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.genres?.some((g) => g.toLowerCase().includes(q))
        ),
        normalizedPage
      );
      return {
        items,
        page: normalizedPage,
        totalPages: 1,
        totalResults: items.length,
      };
    }

    const url = this.buildUrl("/search/multi", {
      query,
      page: String(normalizedPage),
    });
    const result = await safeFetchJson(url, TmdbPaginatedResponseSchema, {
      ...this.requestOptions(),
    });

    if (result.error || !result.data?.results) {
      return { items: [], page: normalizedPage, totalPages: 1, totalResults: 0 };
    }

    const items = result.data.results
      .filter((item) => {
        const raw = item as Record<string, unknown>;
        return raw.media_type === "movie" || raw.media_type === "tv";
      })
      .map((item) => {
        const raw = item as Record<string, unknown>;
        const type = raw.media_type === "movie" ? "movie" : "series";
        return toMediaModel({ ...raw, type });
      });

    return {
      items,
      page: result.data.page,
      totalPages: Math.min(result.data.total_pages, 500),
      totalResults: result.data.total_results,
    };
  }
}

export const tmdbMetadataProvider = new TmdbMetadataProvider();
