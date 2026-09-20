import { NextRequest, NextResponse } from "next/server";
import { metadataService } from "@/services/metadata/metadata.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  const { id, season: seasonParam } = await params;
  const season = Number(seasonParam);

  if (!id.trim() || !Number.isInteger(season) || season < 1) {
    return NextResponse.json(
      { error: "Série ou temporada inválida." },
      { status: 400 }
    );
  }

  const episodes = await metadataService.getEpisodes(id, season);

  return NextResponse.json(episodes, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
