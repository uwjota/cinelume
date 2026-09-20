import { PROVIDER_CONFIG } from "@/config/providers";
import { sanitizeId, parsePositiveInt } from "@/lib/validation";

export const DEFAULT_PLAYER_SERVER_ID = "superflix";

export interface VideoProvider {
  id: string;
  label: string;
  getMovieUrl(id: string): string;
  getEpisodeUrl(id: string, season: number, episode: number): string;
}

abstract class BrazilianVideoProvider implements VideoProvider {
  public abstract readonly id: string;
  public abstract readonly label: string;
  protected abstract readonly baseUrl: string;

  getMovieUrl(id: string): string {
    const cleanId = sanitizeId(id);
    return `${this.baseUrl}/filme/${cleanId}#noLink`;
  }

  getEpisodeUrl(id: string, season: number, episode: number): string {
    const cleanId = sanitizeId(id);
    const s = parsePositiveInt(season, 1);
    const e = parsePositiveInt(episode, 1);
    return `${this.baseUrl}/serie/${cleanId}/${s}/${e}#noLink`;
  }
}

export class SuperFlixVideoProvider extends BrazilianVideoProvider {
  public readonly id = "superflix";
  public readonly label = "Servidor 1";
  protected readonly baseUrl = PROVIDER_CONFIG.players.superflixBaseUrl;
}

export class WarezCdnVideoProvider extends BrazilianVideoProvider {
  public readonly id = "warezcdn";
  public readonly label = "Servidor 2";
  protected readonly baseUrl = PROVIDER_CONFIG.players.warezCdnBaseUrl;
}

export class PlayerRegistry {
  private providers: Map<string, VideoProvider> = new Map();

  constructor() {
    this.register(new SuperFlixVideoProvider());
    this.register(new WarezCdnVideoProvider());
  }

  register(provider: VideoProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: string): VideoProvider | undefined {
    return this.providers.get(id);
  }

  getAll(): VideoProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Validates if a generated playback URL matches the strict security allowlist.
   */
  isUrlAllowed(url: string): boolean {
    try {
      const parsed = new URL(url);
      return PROVIDER_CONFIG.players.allowedDomains.some(
        (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }
}

export const playerRegistry = new PlayerRegistry();
