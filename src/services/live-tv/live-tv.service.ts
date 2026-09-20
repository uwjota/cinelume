import { reiDosEmbedsLiveTvProvider } from "@/providers/live-tv/reidosembeds.provider";
import type { LiveChannel } from "@/types";

export class CinelumeLiveTvService {
  async getChannels(category?: string): Promise<LiveChannel[]> {
    return reiDosEmbedsLiveTvProvider.getChannels(category);
  }

  async getCategories(): Promise<string[]> {
    return reiDosEmbedsLiveTvProvider.getCategories();
  }

  async getChannelById(id: string): Promise<LiveChannel | null> {
    return reiDosEmbedsLiveTvProvider.getChannelById(id);
  }

  async searchChannels(query: string, category?: string): Promise<LiveChannel[]> {
    const channels = await this.getChannels(category);
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalizedQuery) return channels;

    return channels.filter((channel) =>
      [channel.name, channel.category, channel.nowPlaying].some((value) =>
        value?.toLocaleLowerCase("pt-BR").includes(normalizedQuery)
      )
    );
  }
}

export const liveTvService = new CinelumeLiveTvService();
