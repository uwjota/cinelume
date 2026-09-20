import type { Media } from "@/types";
import { MediaCard, MediaCardSkeleton } from "./MediaCard";

interface MediaGridProps {
  items: Media[];
  loading?: boolean;
  showType?: boolean;
}

export function MediaGrid({ items, loading = false, showType = false }: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
      {items.map((item) => (
        <MediaCard key={item.id} media={item} showType={showType} />
      ))}
    </div>
  );
}
