import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Minha Lista",
  description: "Seus filmes e séries favoritos salvos neste dispositivo.",
  path: "/minha-lista",
  noIndex: true,
});

export default function MinhaListaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
