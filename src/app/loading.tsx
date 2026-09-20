import { HeroSkeleton } from "@/components/feedback/HeroSkeleton";
import { MediaGrid } from "@/components/media/MediaGrid";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Carregando conteúdo…</span>
      <HeroSkeleton />
      <div className="mx-auto -mt-6 flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-16 md:px-6 lg:px-8">
        <div className="h-7 w-48 animate-pulse rounded bg-cine-surface" />
        <MediaGrid items={[]} loading />
      </div>
    </div>
  );
}
