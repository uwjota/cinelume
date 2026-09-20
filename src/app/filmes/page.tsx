import { catalogService } from "@/services/catalog/catalog.service";
import { FilmesClient } from "./FilmesClient";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600;
export const metadata = createPageMetadata({
  title: "Filmes",
  description: "Explore filmes populares, lançamentos e títulos de todos os gêneros no Cinelume.",
  path: "/filmes",
});

export default async function FilmesPage() {
  const [catalog, releases] = await Promise.all([
    catalogService.getCatalog("movie"),
    catalogService.getNewReleases(1),
  ]);

  return (
    <div>
      <FilmesClient initialCatalog={catalog} initialReleases={releases} />
    </div>
  );
}
