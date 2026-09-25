import { catalogService } from "@/services/catalog/catalog.service";
import { CatalogCollectionClient } from "@/components/media/CatalogCollectionClient";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;
export const metadata = createPageMetadata({
  title: "Animes",
  description: "Descubra animes, aventuras, fantasia e grandes sagas no catálogo do Cinelume.",
  path: "/animes",
});

export default async function AnimesPage() {
  const catalog = await catalogService.getCatalog("anime");

  return (
    <div>
      <CatalogCollectionClient
        title="Animes"
        description="Encontre seu próximo anime por gênero."
        mediaType="anime"
        initialCatalog={catalog}
      />
    </div>
  );
}
