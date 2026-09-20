"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-[#09090B] px-6 text-white">
        <main className="max-w-lg text-center">
          <h1 className="text-2xl font-extrabold">O Cinelume encontrou um erro</h1>
          <p className="mt-3 text-sm text-[#A1A1AA]">
            Tente reiniciar a interface. Seus dados locais permanecerão salvos.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 min-h-11 rounded-lg bg-[#FF0000] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Reiniciar
          </button>
        </main>
      </body>
    </html>
  );
}
