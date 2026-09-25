import catalog from "@/data/embedtv-channels.json";
import { toChannelModel } from "@/adapters/channel.adapter";
import type { LiveChannel } from "@/types";

type EmbedTvChannel = (typeof catalog.channels)[number];

/**
 * Primary channel catalog supplied by EmbedTV. The provided catalog does not
 * expose a refresh endpoint, so it is bundled as a versioned snapshot.
 */
export class EmbedTvLiveTvProvider {
  private readonly categoryNames = new Map(
    catalog.categories.map((category) => [category.id, category.name])
  );

  async getChannels(category?: string): Promise<LiveChannel[]> {
    const categoryId = this.getCategoryId(category);
    const channels = categoryId === undefined
      ? catalog.channels
      : catalog.channels.filter((channel) => channel.categories.includes(categoryId));

    return channels.map((channel) => this.toChannelModel(channel));
  }

  async getCategories(): Promise<string[]> {
    return catalog.categories
      .filter((category) => category.id !== 0)
      .map((category) => category.name);
  }

  async getChannelById(id: string): Promise<LiveChannel | null> {
    const channel = catalog.channels.find((item) => item.id === id);
    return channel ? this.toChannelModel(channel) : null;
  }

  private getCategoryId(category?: string): number | undefined {
    if (!category || category === "Todos") return undefined;
    return catalog.categories.find(
      (item) => item.name.localeCompare(category, "pt-BR", { sensitivity: "base" }) === 0
    )?.id ?? -1;
  }

  private toChannelModel(channel: EmbedTvChannel): LiveChannel {
    const primaryCategoryId = channel.categories.find((id) => id !== 0);
    return toChannelModel({
      id: channel.id,
      name: channel.name,
      logo: channel.image,
      preview: channel.preview,
      embed_url: channel.url,
      category: this.categoryNames.get(primaryCategoryId ?? 0) || "Variedades",
    });
  }
}

export const embedTvLiveTvProvider = new EmbedTvLiveTvProvider();
