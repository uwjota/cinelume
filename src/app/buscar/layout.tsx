import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Buscar",
  description: "Pesquise filmes, séries, animes, doramas, canais e eventos esportivos no Cinelume.",
  path: "/buscar",
});

export default function BuscarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
