"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cinelume route error", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <AlertTriangle className="mb-5 h-14 w-14 text-cine-brand" aria-hidden="true" />
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
        Não foi possível carregar esta página
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cine-text-secondary sm:text-base">
        Ocorreu uma falha temporária. Tente carregar o conteúdo novamente.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-cine-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cine-brand-hover"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Tentar novamente
      </button>
    </div>
  );
}
