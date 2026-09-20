import { notFound } from "next/navigation";
import { metadataService } from "@/services/metadata/metadata.service";
import { catalogService } from "@/services/catalog/catalog.service";
import { SeriesDetailView } from "@/components/media/SeriesDetailView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serie = await metadataService.getDetails(id, "series");

  return serie
    ? createPageMetadata({
        title: serie.title,
        description: serie.overview || `Temporadas e episódios de ${serie.title} no Cinelume.`,
        path: `/serie/${serie.id}`,
        image: serie.backdrop || serie.poster,
      })
    : createPageMetadata({
        title: "Série não encontrada",
        description: "Esta série não está disponível no Cinelume.",
        path: `/serie/${id}`,
        noIndex: true,
      });
}

export default async function SerieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [serie, popular] = await Promise.all([
    metadataService.getDetails(id, "series"),
    catalogService.getPopularSeries(),
  ]);

  if (!serie) {
    notFound();
  }

  const recommendations = [...(serie.recommendations ?? []), ...popular]
    .filter((item) => item.id !== serie.id)
    .filter((item, index, collection) => collection.findIndex((candidate) => candidate.id === item.id) === index);

  return (
    <SeriesDetailView
      media={serie}
      backUrl="/series"
      backLabel="Voltar para Séries"
      recommendations={recommendations}
    />
  );
}
