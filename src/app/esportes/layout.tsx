import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Esportes",
  description: "Acompanhe a agenda e as transmissões de eventos esportivos no Cinelume.",
  path: "/esportes",
});

export default function EsportesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
