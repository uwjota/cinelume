import { notFound } from "next/navigation";
import { metadataService } from "@/services/metadata/metadata.service";
import { catalogService } from "@/services/catalog/catalog.service";
import { SeriesDetailView } from "@/components/media/SeriesDetailView";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dorama = await metadataService.getDetails(id, "dorama");

  return dorama
    ? createPageMetadata({
        title: dorama.title,
        description: dorama.overview || `Temporadas e episódios de ${dorama.title} no Cinelume.`,
        path: `/dorama/${dorama.id}`,
        image: dorama.backdrop || dorama.poster,
      })
    : createPageMetadata({
        title: "Dorama não encontrado",
        description: "Este dorama não está disponível no Cinelume.",
        path: `/dorama/${id}`,
        noIndex: true,
      });
}

export default async function DoramaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [dorama, popular] = await Promise.all([
    metadataService.getDetails(id, "dorama"),
    catalogService.getPopularDoramas(),
  ]);

  if (!dorama) {
    notFound();
  }

  const recommendations = [...(dorama.recommendations ?? []), ...popular]
    .filter((item) => item.id !== dorama.id)
    .filter((item, index, collection) => collection.findIndex((candidate) => candidate.id === item.id) === index);

  return (
    <SeriesDetailView
      media={dorama}
      backUrl="/doramas"
      backLabel="Voltar para Doramas"
      recommendations={recommendations}
    />
  );
}
