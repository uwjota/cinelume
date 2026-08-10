import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "cinelume.app";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: "CineLume — Filmes, séries e TV ao vivo",
    description: "Seu espaço para descobrir filmes, séries, animes, doramas e TV ao vivo.",
    icons: {
      icon: "/cinelume-icon.png",
      shortcut: "/cinelume-icon.png",
      apple: "/cinelume-icon.png",
    },
    openGraph: {
      title: "CineLume — Filmes, séries e TV ao vivo",
      description: "Uma experiência premium para descobrir o que assistir.",
      images: [{ url: socialImage, width: 1792, height: 896, alt: "CineLume" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "CineLume — Filmes, séries e TV ao vivo",
      description: "Uma experiência premium para descobrir o que assistir.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
