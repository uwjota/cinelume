import { notFound } from "next/navigation";
import { metadataService } from "@/services/metadata/metadata.service";
import { catalogService } from "@/services/catalog/catalog.service";
import { SeriesDetailView } from "@/components/media/SeriesDetailView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const anime = await metadataService.getDetails(id, "anime");

  return anime
    ? createPageMetadata({
        title: anime.title,
        description: anime.overview || `Temporadas e episódios de ${anime.title} no Cinelume.`,
        path: `/anime/${anime.id}`,
        image: anime.backdrop || anime.poster,
      })
    : createPageMetadata({
        title: "Anime não encontrado",
        description: "Este anime não está disponível no Cinelume.",
        path: `/anime/${id}`,
        noIndex: true,
      });
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [anime, popular] = await Promise.all([
    metadataService.getDetails(id, "anime"),
    catalogService.getPopularAnimes(),
  ]);

  if (!anime) {
    notFound();
  }

  const recommendations = [...(anime.recommendations ?? []), ...popular]
    .filter((item) => item.id !== anime.id)
    .filter((item, index, collection) => collection.findIndex((candidate) => candidate.id === item.id) === index);

  return (
    <SeriesDetailView
      media={anime}
      backUrl="/animes"
      backLabel="Voltar para Animes"
      recommendations={recommendations}
    />
  );
}
