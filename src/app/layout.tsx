import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { QueryProvider } from "@/lib/query";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { ScrollRestoration } from "@/components/layout/ScrollRestoration";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/metadata";

export const viewport: Viewport = {
  themeColor: "#09090B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: SITE_NAME,
  title: {
    default: "Cinelume — Filmes, séries, TV e esportes",
    template: "%s | Cinelume",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "filmes",
    "séries",
    "animes",
    "doramas",
    "TV ao vivo",
    "esportes",
    "Cinelume",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "entretenimento",
  referrer: "strict-origin-when-cross-origin",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  icons: {
    icon: [
      { url: "/branding/cinelume_favicon.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Cinelume — Filmes, séries, TV e esportes",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: "/",
    images: [
      {
        url: "/branding/cinelume_icon.png",
        width: 1254,
        height: 1254,
        alt: "Cinelume",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Cinelume — Filmes, séries, TV e esportes",
    description: SITE_DESCRIPTION,
    images: ["/branding/cinelume_icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-cine-bg text-cine-text-primary antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Ir para o conteúdo
        </a>
        <QueryProvider>
          <ScrollRestoration />
          <AppHeader />
          <main
            id="main-content"
            className="flex-1 pt-7 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] xl:pb-12"
          >
            {children}
          </main>
          <MobileBottomNav />
        </QueryProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
