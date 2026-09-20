import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <SearchX className="mb-5 h-14 w-14 text-cine-brand" aria-hidden="true" />
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-cine-brand">
        Erro 404
      </p>
      <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
        Conteúdo não encontrado
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cine-text-secondary sm:text-base">
        O endereço pode ter mudado ou este conteúdo não está mais disponível.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg bg-cine-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cine-brand-hover"
        >
          Voltar ao início
        </Link>
        <Link
          href="/buscar"
          className="inline-flex min-h-11 items-center rounded-lg border border-cine-border bg-cine-surface px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cine-surface-elevated"
        >
          Pesquisar
        </Link>
      </div>
    </div>
  );
}
