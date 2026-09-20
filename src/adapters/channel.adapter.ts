import type { LiveChannel } from "@/types";

/**
 * Normalizes raw external TV channel data into the Cinelume LiveChannel model.
 */
export function toChannelModel(raw: {
  id: string | number;
  name?: string;
  description?: string;
  logo?: string;
  preview?: string;
  category?: string;
  embed_url?: string;
  now_playing?: string;
  progress?: number;
  next_programmes?: Array<{ title: string; start?: string; end?: string }>;
}): LiveChannel {
  return {
    id: String(raw.id),
    name: raw.name || "Canal",
    description: raw.description,
    logo: raw.logo,
    preview: raw.preview,
    category: raw.category || "Variedades",
    embedUrl: raw.embed_url,
    nowPlaying: raw.now_playing,
    progress: raw.progress,
    nextProgrammes: raw.next_programmes,
  };
}
