import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Sem conexão",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <WifiOff className="mb-5 h-14 w-14 text-cine-brand" aria-hidden="true" />
      <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
        Você está sem conexão
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cine-text-secondary sm:text-base">
        Verifique sua internet e tente novamente. Seus favoritos, histórico e
        configurações continuam armazenados neste dispositivo.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-cine-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cine-brand-hover"
      >
        Tentar novamente
      </Link>
    </div>
  );
}
