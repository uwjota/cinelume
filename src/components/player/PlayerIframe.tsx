"use client";

import { playerRegistry } from "@/services/players/player.service";
import { AlertTriangle } from "lucide-react";

interface PlayerIframeProps {
  url: string;
  title: string;
  onLoad?: () => void;
  sandboxed?: boolean;
}

/**
 * Dedicated, secured iframe component.
 * Rejects any non-allowlisted domains to prevent arbitrary URL injection attacks.
 */
export function PlayerIframe({
  url,
  title,
  onLoad,
  sandboxed = true,
}: PlayerIframeProps) {
  const isAllowed = playerRegistry.isUrlAllowed(url);

  if (!isAllowed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-black/90 text-white">
        <AlertTriangle className="w-12 h-12 text-cine-brand mb-3" />
        <h3 className="text-base font-bold mb-1">Reprodução Bloqueada</h3>
        <p className="text-xs text-cine-text-secondary max-w-sm">
          Por motivos de segurança, o domínio de reprodução informado não pertence à lista de provedores autorizados do Cinelume.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title={title}
      className="w-full h-full border-0 absolute inset-0"
      sandbox={
        sandboxed
          // Intentionally omits popup and top-navigation permissions. The
          // cross-origin player can stream, store state and use fullscreen,
          // but ads cannot replace the Cinelume tab or open another window.
          ? "allow-scripts allow-same-origin allow-forms allow-presentation allow-modals allow-pointer-lock allow-storage-access-by-user-activation"
          : undefined
      }
      allow="autoplay *; encrypted-media *; picture-in-picture *; fullscreen *"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={onLoad}
      tabIndex={0}
    />
  );
}
