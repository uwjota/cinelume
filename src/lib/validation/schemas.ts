import { z } from "zod";

// ==========================================
// TMDB SCHEMAS
// ==========================================

export const TmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string().default("Gênero"),
});

export const TmdbCastMemberSchema = z.object({
  id: z.number(),
  name: z.string().default("Ator"),
  character: z.string().optional(),
  profile_path: z.string().nullable().optional(),
});

export const TmdbCrewMemberSchema = z.object({
  id: z.number(),
  name: z.string().default("Diretor"),
  job: z.string().optional(),
  department: z.string().optional(),
});

export const TmdbEpisodeSchema = z.object({
  id: z.number(),
  episode_number: z.number(),
  season_number: z.number().default(1),
  name: z.string().default("Episódio"),
  overview: z.string().optional().default(""),
  still_path: z.string().nullable().optional(),
  runtime: z.number().nullable().optional(),
  air_date: z.string().nullable().optional(),
});

export const TmdbSeasonSchema = z.object({
  id: z.number().optional(),
  season_number: z.number(),
  name: z.string().default("Temporada"),
  episode_count: z.number().default(0),
  poster_path: z.string().nullable().optional(),
  overview: z.string().optional().default(""),
  episodes: z.array(TmdbEpisodeSchema).optional(),
});

export const TmdbMovieItemSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  original_title: z.string().optional(),
  overview: z.string().optional().default(""),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  vote_average: z.number().optional().default(0),
  genre_ids: z.array(z.number()).optional().default([]),
  genres: z.array(TmdbGenreSchema).optional(),
  runtime: z.number().nullable().optional(),
}).passthrough();

export const TmdbTvItemSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  original_name: z.string().optional(),
  overview: z.string().optional().default(""),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional().default(0),
  genre_ids: z.array(z.number()).optional().default([]),
  genres: z.array(TmdbGenreSchema).optional(),
  seasons: z.array(TmdbSeasonSchema).optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
  episode_run_time: z.array(z.number()).optional(),
}).passthrough();

export const TmdbPaginatedResponseSchema = z.object({
  page: z.number().default(1),
  results: z.array(z.unknown()).default([]),
  total_pages: z.number().default(1),
  total_results: z.number().default(0),
});

// ==========================================
// REI DOS EMBEDS SCHEMAS (Live TV & Sports)
// ==========================================

export const ReiDosEmbedsChannelSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string().default("Canal"),
  description: z.string().optional().default(""),
  logo_url: z.string().optional(),
  preview_url: z.string().optional(),
  embed_url: z.string().optional(),
  category: z.string().optional().default("Variedades"),
  is_active: z.boolean().optional().default(true),
  now_playing_title: z.string().optional(),
  now_playing_progress: z.number().optional(),
  now_playing_has_guide: z.boolean().optional(),
  now_playing_next_programmes: z
    .array(
      z.object({
        title: z.string().default("Programa"),
        start: z.string().optional(),
        end: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export const ReiDosEmbedsCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ReiDosEmbedsStreamEmbedSchema = z.object({
  provider: z.string().default("Servidor"),
  quality: z.string().optional().default("HD"),
  slug: z.string().optional(),
  logo: z.string().optional(),
  embed_url: z.string().default(""),
});

export const ReiDosEmbedsEventSchema = z.object({
  id: z.string().or(z.number()),
  title: z.string().default("Evento Esportivo"),
  description: z.string().optional().default(""),
  poster: z.string().optional(),
  time1: z.string().optional(),
  time2: z.string().optional(),
  time1_name: z.string().optional(),
  time2_name: z.string().optional(),
  visual_model: z.string().optional().default("versus"),
  sport_key: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  status: z.enum(["upcoming", "live", "finished"]).or(z.string()).default("upcoming"),
  category: z.string().optional().default("Futebol"),
  competition: z.string().optional(),
  slug: z.string().optional(),
  page_url: z.string().optional(),
  play_event_url: z.string().optional(),
  embeds: z.array(ReiDosEmbedsStreamEmbedSchema).optional().default([]),
});

export const ReiDosEmbedsEventsResponseSchema = z.object({
  success: z.boolean().optional().default(true),
  data: z.array(ReiDosEmbedsEventSchema).default([]),
  total: z.number().optional(),
});

export const ReiDosEmbedsChannelsResponseSchema = z.object({
  success: z.boolean().optional().default(true),
  data: z.union([
    z.array(ReiDosEmbedsChannelSchema),
    ReiDosEmbedsChannelSchema,
  ]).default([]),
});

export const ReiDosEmbedsChannelDetailResponseSchema = z.object({
  success: z.boolean().optional().default(true),
  data: ReiDosEmbedsChannelSchema,
});

export const ReiDosEmbedsEventDetailResponseSchema = z.object({
  success: z.boolean().optional().default(true),
  data: z.union([
    ReiDosEmbedsEventSchema,
    z.array(ReiDosEmbedsEventSchema).transform((items) => items[0]),
    z
      .object({ events: z.array(ReiDosEmbedsEventSchema).default([]) })
      .transform((result) => result.events[0]),
  ]),
});

export const ReiDosEmbedsCategoriesResponseSchema = z.object({
  success: z.boolean().optional().default(true),
  data: z.array(ReiDosEmbedsCategorySchema).default([]),
});
