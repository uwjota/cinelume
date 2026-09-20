import { NextRequest, NextResponse } from "next/server";
import { getCatalogGenreId } from "@/config/catalog-filters";
import type { CatalogMediaType, CatalogSort } from "@/config/catalog-filters";
import { catalogService } from "@/services/catalog/catalog.service";

const VALID_TYPES = new Set<CatalogMediaType>([
  "movie",
  "series",
  "anime",
  "dorama",
]);
const VALID_SORTS = new Set<CatalogSort>([
  "popularity",
  "rating",
  "year",
  "title",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as CatalogMediaType;
  const genre = searchParams.get("genre") || "all";
  const sort = searchParams.get("sort") as CatalogSort;
  const requestedPage = Number(searchParams.get("page") || "1");

  if (!VALID_TYPES.has(type) || !VALID_SORTS.has(sort)) {
    return NextResponse.json({ error: "Parâmetros de catálogo inválidos." }, { status: 400 });
  }

  const page = Number.isFinite(requestedPage)
    ? Math.max(1, Math.min(Math.floor(requestedPage), 500))
    : 1;
  const result = await catalogService.getCatalog(
    type,
    page,
    getCatalogGenreId(type, genre),
    sort
  );

  return NextResponse.json(result, {
    headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" },
  });
}
