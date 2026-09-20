interface GenreChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function GenreChip({ label, active = false, onClick }: GenreChipProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      onClick={onClick}
      className={`inline-flex min-h-10 items-center border-b-2 px-1.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand sm:text-sm ${
        active
          ? "border-cine-brand text-white"
          : "border-transparent text-cine-text-muted hover:border-cine-border hover:text-cine-text-secondary"
      }`}
    >
      {label}
    </Component>
  );
}
