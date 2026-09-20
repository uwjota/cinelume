import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

const ROUTES = [
  "",
  "/filmes",
  "/series",
  "/animes",
  "/doramas",
  "/tv",
  "/esportes",
  "/buscar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ROUTES.map((route, index) => ({
    url: new URL(route || "/", SITE_URL).toString(),
    lastModified: now,
    changeFrequency: index === 0 ? "daily" : "weekly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
