import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Não foi possível carregar este conteúdo.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <AlertCircle className="w-10 h-10 text-cine-text-muted mb-4" />
      <p className="text-sm text-cine-text-secondary mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-cine-surface hover:bg-cine-surface-elevated border border-cine-border rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cine-brand"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
