import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  message = "Nenhum resultado encontrado.",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon || <Inbox className="w-12 h-12 text-cine-text-muted mb-4" />}
      <p className="text-sm text-cine-text-secondary">{message}</p>
    </div>
  );
}
