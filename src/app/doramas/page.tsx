import { catalogService } from "@/services/catalog/catalog.service";
import { CatalogCollectionClient } from "@/components/media/CatalogCollectionClient";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;
export const metadata = createPageMetadata({
  title: "Doramas",
  description: "Explore K-dramas e produções asiáticas de romance, drama, suspense e fantasia.",
  path: "/doramas",
});

export default async function DoramasPage() {
  const catalog = await catalogService.getCatalog("dorama");

  return (
    <div>
      <CatalogCollectionClient
        title="Doramas"
        description="K-dramas e produções asiáticas com romance, drama, suspense e fantasia."
        mediaType="dorama"
        initialCatalog={catalog}
      />
    </div>
  );
}
