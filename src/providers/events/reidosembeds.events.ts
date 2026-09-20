import { PROVIDER_CONFIG } from "@/config/providers";
import { safeFetchJson } from "@/lib/http/client";
import {
  ReiDosEmbedsEventsResponseSchema,
  ReiDosEmbedsCategoriesResponseSchema,
  ReiDosEmbedsEventDetailResponseSchema,
} from "@/lib/validation/schemas";
import { toEventModel } from "@/adapters/event.adapter";
import type { LiveEvent } from "@/types";

export class ReiDosEmbedsEventsProvider {
  private baseUrl = PROVIDER_CONFIG.liveTv.providerUrl;
  private timeoutMs = PROVIDER_CONFIG.timeouts.live;

  /**
   * Fetches sports events with optional sport and status filter.
   */
  async getEvents(category?: string, status?: string): Promise<LiveEvent[]> {
    const params = new URLSearchParams();
    if (category && category !== "Todos") params.set("category", category);
    if (status) params.set("status", status);

    const qs = params.toString();
    const url = qs
      ? `${this.baseUrl}/eventos?${qs}`
      : `${this.baseUrl}/eventos`;

    const result = await safeFetchJson(url, ReiDosEmbedsEventsResponseSchema, {
      timeoutMs: this.timeoutMs,
      next: { revalidate: 120 }, // 2 minutes cache for live sports
    });

    if (result.error || !result.data?.data) {
      return [];
    }

    return result.data.data.map((ev) =>
      toEventModel({
        id: ev.id,
        title: ev.title,
        sport: ev.category || ev.sport_key,
        competition: ev.competition,
        status: ev.status as "upcoming" | "live" | "finished",
        start_time: ev.start_time,
        poster: ev.poster,
        description: ev.description,
        home_team: ev.time1_name
          ? { name: ev.time1_name, logo: ev.time1 }
          : undefined,
        away_team: ev.time2_name
          ? { name: ev.time2_name, logo: ev.time2 }
          : undefined,
        streams: ev.embeds?.map((e) => ({
          id: e.slug || e.provider,
          name: e.provider,
          quality: e.quality,
          url: e.embed_url,
        })),
      })
    );
  }

  /**
   * Fetches event categories.
   */
  async getCategories(): Promise<string[]> {
    const url = `${this.baseUrl}/eventos/categories`;
    const result = await safeFetchJson(
      url,
      ReiDosEmbedsCategoriesResponseSchema,
      {
        timeoutMs: this.timeoutMs,
        next: { revalidate: 3600 },
      }
    );

    if (result.error || !result.data?.data) {
      return ["Todos", "Futebol", "Basquete", "MMA", "Vôlei", "Outros"];
    }

    return ["Todos", ...result.data.data.map((c) => c.name)];
  }

  /**
   * Fetches a specific event by ID.
   */
  async getEventById(id: string): Promise<LiveEvent | null> {
    const url = `${this.baseUrl}/eventos/${encodeURIComponent(id)}`;
    const result = await safeFetchJson(url, ReiDosEmbedsEventDetailResponseSchema, {
      timeoutMs: this.timeoutMs,
    });

    if (result.error || !result.data?.data) {
      return null;
    }

    const ev = result.data.data;
    return toEventModel({
      id: ev.id,
      title: ev.title,
      sport: ev.category || ev.sport_key,
      competition: ev.competition,
      status: ev.status as "upcoming" | "live" | "finished",
      start_time: ev.start_time,
      poster: ev.poster,
      description: ev.description,
      home_team: ev.time1_name
        ? { name: ev.time1_name, logo: ev.time1 }
        : undefined,
      away_team: ev.time2_name
        ? { name: ev.time2_name, logo: ev.time2 }
        : undefined,
      streams: ev.embeds?.map((e) => ({
        id: e.slug || e.provider,
        name: e.provider,
        quality: e.quality,
        url: e.embed_url,
      })),
    });
  }
}

export const reiDosEmbedsEventsProvider = new ReiDosEmbedsEventsProvider();
