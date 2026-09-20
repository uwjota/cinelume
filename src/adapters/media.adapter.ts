import type { Media, MediaType } from "@/types";

export interface RawMediaInput {
  id?: string | number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genres?: Array<{ id: number; name: string }>;
  genre_ids?: number[];
  type?: MediaType;
  media_type?: "movie" | "tv";
  [key: string]: unknown;
}

const MOVIE_GENRES: Record<number, string> = {
  12: "Aventura",
  14: "Fantasia",
  16: "Animação",
  18: "Drama",
  27: "Terror",
  28: "Ação",
  35: "Comédia",
  36: "História",
  37: "Faroeste",
  53: "Suspense",
  80: "Crime",
  99: "Documentário",
  878: "Ficção Científica",
  9648: "Mistério",
  10402: "Música",
  10749: "Romance",
  10751: "Família",
  10752: "Guerra",
};

const TV_GENRES: Record<number, string> = {
  16: "Animação",
  18: "Drama",
  35: "Comédia",
  37: "Faroeste",
  80: "Crime",
  99: "Documentário",
  9648: "Mistério",
  10751: "Família",
  10759: "Ação e Aventura",
  10762: "Infantil",
  10763: "Notícias",
  10764: "Reality",
  10765: "Ficção Científica e Fantasia",
  10766: "Novela",
  10767: "Talk Show",
  10768: "Guerra e Política",
};

/**
 * Normalizes raw external metadata into the unified Cinelume Media model.
 * Resilient against missing IDs, null fields, or unexpected shapes from external APIs.
 */
export function toMediaModel(raw: RawMediaInput): Media {
  const dateStr =
    typeof raw.release_date === "string"
      ? raw.release_date
      : typeof raw.first_air_date === "string"
        ? raw.first_air_date
        : undefined;

  const year = dateStr ? new Date(dateStr).getFullYear() : undefined;

  const rawId = raw.id !== undefined && raw.id !== null ? String(raw.id) : "";
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title
      : typeof raw.name === "string" && raw.name.trim()
        ? raw.name
        : "Sem título";

  const originalTitle =
    typeof raw.original_title === "string"
      ? raw.original_title
      : typeof raw.original_name === "string"
        ? raw.original_name
        : undefined;

  const overview = typeof raw.overview === "string" ? raw.overview : "";

  const poster =
    typeof raw.poster_path === "string" && raw.poster_path
      ? `https://image.tmdb.org/t/p/w500${raw.poster_path}`
      : typeof raw.poster === "string"
        ? raw.poster
        : undefined;

  const backdrop =
    typeof raw.backdrop_path === "string" && raw.backdrop_path
      ? `https://image.tmdb.org/t/p/original${raw.backdrop_path}`
      : typeof raw.backdrop === "string"
        ? raw.backdrop
        : undefined;

  const rating =
    typeof raw.vote_average === "number"
      ? Number(raw.vote_average.toFixed(1))
      : undefined;

  const rawType = raw.type as MediaType | undefined;
  const type: MediaType =
    rawType === "movie" ||
    rawType === "series" ||
    rawType === "anime" ||
    rawType === "dorama"
      ? rawType
      : raw.media_type === "tv"
        ? "series"
        : "movie";

  const genreMap = type === "movie" ? MOVIE_GENRES : TV_GENRES;
  const genres = Array.isArray(raw.genres)
    ? raw.genres.map((g) => g.name).filter(Boolean)
    : Array.isArray(raw.genre_ids)
      ? raw.genre_ids.map((id) => genreMap[id]).filter(Boolean)
      : [];

  const numericId = Number(rawId);

  return {
    id: rawId,
    tmdbId: Number.isSafeInteger(numericId) ? numericId : undefined,
    title,
    originalTitle,
    overview,
    poster,
    backdrop,
    year: Number.isNaN(year) ? undefined : year,
    rating,
    genres,
    type,
  };
}
