export type CatalogMediaType = "movie" | "series" | "anime" | "dorama";
export type CatalogSort = "popularity" | "rating" | "year" | "title";

export interface CatalogGenre {
  id: string;
  label: string;
  tmdbId?: number;
}

export const MOVIE_GENRES: CatalogGenre[] = [
  { id: "all", label: "Todos" },
  { id: "action", label: "Ação", tmdbId: 28 },
  { id: "adventure", label: "Aventura", tmdbId: 12 },
  { id: "comedy", label: "Comédia", tmdbId: 35 },
  { id: "drama", label: "Drama", tmdbId: 18 },
  { id: "science-fiction", label: "Ficção Científica", tmdbId: 878 },
  { id: "horror", label: "Terror", tmdbId: 27 },
  { id: "thriller", label: "Suspense", tmdbId: 53 },
  { id: "animation", label: "Animação", tmdbId: 16 },
];

export const SERIES_GENRES: CatalogGenre[] = [
  { id: "all", label: "Todas" },
  { id: "drama", label: "Drama", tmdbId: 18 },
  { id: "crime", label: "Crime", tmdbId: 80 },
  { id: "science-fiction", label: "Ficção Científica", tmdbId: 10765 },
  { id: "fantasy", label: "Fantasia", tmdbId: 10765 },
  { id: "action", label: "Ação", tmdbId: 10759 },
  { id: "mystery", label: "Mistério", tmdbId: 9648 },
  { id: "comedy", label: "Comédia", tmdbId: 35 },
];

export const ANIME_GENRES: CatalogGenre[] = [
  { id: "all", label: "Todos" },
  { id: "action", label: "Ação e Aventura", tmdbId: 10759 },
  { id: "comedy", label: "Comédia", tmdbId: 35 },
  { id: "drama", label: "Drama", tmdbId: 18 },
  { id: "fantasy", label: "Fantasia", tmdbId: 10765 },
  { id: "mystery", label: "Mistério", tmdbId: 9648 },
  { id: "family", label: "Família", tmdbId: 10751 },
];

export const DORAMA_GENRES: CatalogGenre[] = [
  { id: "all", label: "Todos" },
  { id: "drama", label: "Drama", tmdbId: 18 },
  { id: "comedy", label: "Comédia", tmdbId: 35 },
  { id: "action", label: "Ação e Aventura", tmdbId: 10759 },
  { id: "crime", label: "Crime", tmdbId: 80 },
  { id: "mystery", label: "Mistério", tmdbId: 9648 },
  { id: "fantasy", label: "Fantasia", tmdbId: 10765 },
];

export function getCatalogGenreId(
  type: CatalogMediaType,
  genreId: string
): number | undefined {
  const genres =
    type === "movie"
      ? MOVIE_GENRES
      : type === "series"
        ? SERIES_GENRES
        : type === "anime"
          ? ANIME_GENRES
          : DORAMA_GENRES;
  return genres.find((genre) => genre.id === genreId)?.tmdbId;
}
