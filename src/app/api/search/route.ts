import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@/services/search/search.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const requestedPage = Number(searchParams.get("page") || "1");
  const page = Number.isFinite(requestedPage)
    ? Math.max(1, Math.min(Math.floor(requestedPage), 500))
    : 1;

  if (query.length < 2) {
    return NextResponse.json(
      { error: "Informe ao menos dois caracteres para buscar." },
      { status: 400 }
    );
  }

  const result = await searchService.searchAll(query, page);

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
    },
  });
}
