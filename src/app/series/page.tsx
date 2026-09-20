import { catalogService } from "@/services/catalog/catalog.service";
import { SeriesClient } from "./SeriesClient";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;
export const metadata = createPageMetadata({
  title: "Séries",
  description: "Encontre séries populares, temporadas e episódios para acompanhar no Cinelume.",
  path: "/series",
});

export default async function SeriesPage() {
  const catalog = await catalogService.getCatalog("series");

  return (
    <div>
      <SeriesClient initialCatalog={catalog} />
    </div>
  );
}
