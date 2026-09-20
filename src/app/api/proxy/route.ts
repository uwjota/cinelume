import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/http/client";

const ALLOWED_HOSTS = new Set([
  "reidosembeds.online",
  "api.themoviedb.org",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  if (!target) {
    return NextResponse.json(
      { error: "Parâmetro 'url' é obrigatório." },
      { status: 400 }
    );
  }

  let parsedTarget: URL;
  try {
    parsedTarget = new URL(target);
  } catch {
    return NextResponse.json(
      { error: "URL de destino inválida." },
      { status: 400 }
    );
  }

  // Security check: ensure target domain is in allowlist
  if (!ALLOWED_HOSTS.has(parsedTarget.hostname)) {
    return NextResponse.json(
      { error: "Domínio não autorizado para proxy." },
      { status: 403 }
    );
  }

  try {
    const upstream = await fetchWithTimeout(target, {
      timeoutMs: 8000,
      headers: {
        Accept: "application/json",
      },
    });

    const data = await upstream.text();

    return new NextResponse(data, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") || "application/json",
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao consultar provider.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
