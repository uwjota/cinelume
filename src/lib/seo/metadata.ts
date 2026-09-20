import type { Metadata } from "next";

export const SITE_NAME = "Cinelume";
export const SITE_DESCRIPTION =
  "Filmes, séries, animes, doramas, TV ao vivo e eventos esportivos em uma experiência cinematográfica responsiva.";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
);

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  const socialImage = image || "/branding/cinelume_icon.png";

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [{ url: socialImage, alt: title }],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: [socialImage],
    },
  };
}
