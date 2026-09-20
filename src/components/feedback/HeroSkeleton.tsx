export function HeroSkeleton() {
  return (
    <div className="relative w-full animate-pulse" aria-hidden="true">
      <div className="relative h-[min(68svh,34rem)] min-h-[25rem] w-full overflow-hidden bg-cine-surface sm:h-[min(62svh,35rem)] sm:min-h-[28rem] lg:h-[min(68vh,40rem)] lg:min-h-[30rem]">
        <div className="absolute inset-0 bg-gradient-to-t from-cine-bg via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 md:px-6 lg:px-8 lg:pb-20">
            <div className="max-w-xl">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-12 rounded bg-cine-surface-elevated" />
                <div className="h-4 w-16 rounded bg-cine-surface-elevated" />
              </div>
              <div className="mb-3 h-9 w-[min(18rem,75vw)] rounded bg-cine-surface-elevated sm:h-11 lg:h-14" />
              <div className="mb-2 hidden h-4 w-96 rounded bg-cine-surface-elevated/70 sm:block" />
              <div className="mb-5 hidden h-4 w-64 rounded bg-cine-surface-elevated/50 sm:block" />
              <div className="flex gap-3">
                <div className="h-11 w-28 rounded-lg bg-cine-surface-elevated" />
                <div className="h-11 w-32 rounded-lg bg-cine-surface-elevated/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
