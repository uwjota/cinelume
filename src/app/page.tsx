import { catalogService } from "@/services/catalog/catalog.service";
import { Hero } from "@/components/media/Hero";
import { MediaRow } from "@/components/media/MediaRow";
import { HomeLocalSections } from "@/components/media/HomeLocalSections";
import { heroItems } from "@/lib/mock-data";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 3600; // Revalidate every hour
export const metadata = createPageMetadata({
  title: "Início",
  description: "Descubra filmes, séries, animes, doramas, TV ao vivo e esportes no Cinelume.",
  path: "/",
});

export default async function HomePage() {
  // Fetch catalog sections in parallel with error isolation
  const catalogPages = [1, 2];
  const [
    trendingRes,
    ...catalogRes
  ] = await Promise.allSettled([
    catalogService.getTrending(),
    ...catalogPages.map((page) => catalogService.getNewReleases(page)),
    ...catalogPages.map((page) => catalogService.getPopularSeries(page)),
    catalogService.getPopularAnimes(),
    catalogService.getPopularDoramas(),
  ]);

  const [
    ...releasesRes
  ] = catalogRes.slice(0, catalogPages.length);
  const [
    ...seriesRes
  ] = catalogRes.slice(catalogPages.length, catalogPages.length * 2);
  const [
    animesRes,
    doramasRes,
  ] = catalogRes.slice(catalogPages.length * 2);

  const trending = trendingRes.status === "fulfilled" ? trendingRes.value : [];
  const releases = releasesRes.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
  const series = seriesRes.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
  const animes = animesRes.status === "fulfilled" ? animesRes.value : [];
  const doramas = doramasRes.status === "fulfilled" ? doramasRes.value : [];

  // Hero items derived from trending or fallback
  const heroShowcase = trending.length >= 3 ? trending.slice(0, 5) : heroItems;

  return (
    <div className="flex flex-col gap-8 md:gap-12">
      {/* Hero Showcase */}
      {heroShowcase.length > 0 && <Hero items={heroShowcase} />}

      <div className="flex flex-col gap-8 md:gap-12 -mt-6 sm:-mt-10 lg:-mt-14 relative z-10">
        <HomeLocalSections />

        {/* Em Alta */}
        {trending.length > 0 && (
          <MediaRow title="Em alta" items={trending} showType />
        )}

        {/* Lançamentos */}
        {releases.length > 0 && (
          <MediaRow title="Lançamentos" items={releases} showType />
        )}

        {/* Séries Populares */}
        {series.length > 0 && (
          <MediaRow title="Séries populares" items={series} />
        )}

        {/* Animes em Destaque */}
        {animes.length > 0 && (
          <MediaRow title="Animes em destaque" items={animes} />
        )}

        {/* Doramas Imperdíveis */}
        {doramas.length > 0 && (
          <MediaRow title="Doramas populares" items={doramas} />
        )}
      </div>
    </div>
  );
}
