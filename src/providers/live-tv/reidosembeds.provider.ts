import { PROVIDER_CONFIG } from "@/config/providers";
import { safeFetchJson } from "@/lib/http/client";
import {
  ReiDosEmbedsChannelsResponseSchema,
  ReiDosEmbedsCategoriesResponseSchema,
  ReiDosEmbedsChannelDetailResponseSchema,
} from "@/lib/validation/schemas";
import { toChannelModel } from "@/adapters/channel.adapter";
import type { LiveChannel } from "@/types";

export class ReiDosEmbedsLiveTvProvider {
  private baseUrl = PROVIDER_CONFIG.liveTv.providerUrl;
  private timeoutMs = PROVIDER_CONFIG.timeouts.live;

  /**
   * Fetches all live TV channels from Rei dos Embeds API.
   */
  async getChannels(category?: string): Promise<LiveChannel[]> {
    const url = category
      ? `${this.baseUrl}/channels?category=${encodeURIComponent(category)}`
      : `${this.baseUrl}/channels`;

    const result = await safeFetchJson(url, ReiDosEmbedsChannelsResponseSchema, {
      timeoutMs: this.timeoutMs,
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (result.error || !result.data?.data) {
      return [];
    }

    const rawList = Array.isArray(result.data.data)
      ? result.data.data
      : [result.data.data];

    return rawList.map((ch) =>
      toChannelModel({
        id: ch.id,
        name: ch.name,
        description: ch.description,
        logo: ch.logo_url,
        preview: ch.preview_url,
        category: ch.category,
        embed_url: ch.embed_url,
        now_playing: ch.now_playing_title,
        progress: ch.now_playing_progress,
        next_programmes: ch.now_playing_next_programmes,
      })
    );
  }

  /**
   * Fetches channel categories.
   */
  async getCategories(): Promise<string[]> {
    const url = `${this.baseUrl}/channels/categories`;
    const result = await safeFetchJson(
      url,
      ReiDosEmbedsCategoriesResponseSchema,
      {
        timeoutMs: this.timeoutMs,
        next: { revalidate: 3600 },
      }
    );

    if (result.error || !result.data?.data) {
      return ["Abertos", "Esportes", "Filmes", "Notícias", "Variedades"];
    }

    return result.data.data.map((cat) => cat.name);
  }

  /**
   * Fetches a specific channel by ID.
   */
  async getChannelById(id: string): Promise<LiveChannel | null> {
    const url = `${this.baseUrl}/channels/${encodeURIComponent(id)}`;
    const result = await safeFetchJson(
      url,
      ReiDosEmbedsChannelDetailResponseSchema,
      { timeoutMs: this.timeoutMs }
    );

    if (result.error || !result.data?.data) {
      return null;
    }

    const ch = result.data.data;
    return toChannelModel({
      id: ch.id,
      name: ch.name,
      description: ch.description,
      logo: ch.logo_url,
      preview: ch.preview_url,
      category: ch.category,
      embed_url: ch.embed_url,
      now_playing: ch.now_playing_title,
      progress: ch.now_playing_progress,
      next_programmes: ch.now_playing_next_programmes,
    });
  }
}

export const reiDosEmbedsLiveTvProvider = new ReiDosEmbedsLiveTvProvider();
