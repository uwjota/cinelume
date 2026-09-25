"use client";

import { useState } from "react";
import { ArrowUpRight, Clapperboard, Heart, Pause, Play, Sparkles } from "lucide-react";

const MESSAGES = [
  { text: "Seja apoiador do Cinelume", icon: Heart },
  { text: "Sua contribuição faz a diferença", icon: Sparkles },
  { text: "Ajude a manter o Cinelume no ar", icon: Clapperboard },
  { text: "Gosta do Cinelume? Apoie o projeto", icon: ArrowUpRight },
];

export function SupportBanner() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="support-banner flex h-7 bg-gradient-to-r from-cine-brand-hover via-cine-brand to-cine-brand-hover text-white">
      <a
        href="https://pay.cakto.com.br/3632nfj_1100827"
        target="_self"
        rel="noopener noreferrer"
        aria-label="Seja apoiador do Cinelume"
        className="min-w-0 flex-1 overflow-hidden transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      >
        <span
          aria-hidden="true"
          className="support-banner-track flex h-full w-max motion-reduce:hidden"
          style={{ animationPlayState: paused ? "paused" : "running" }}
        >
          {[0, 1].map((copy) => (
            <span key={copy} className="flex min-w-[100vw] shrink-0 items-center justify-around">
              {MESSAGES.map(({ text, icon: Icon }) => (
                <span key={text} className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-6 text-xs font-semibold tracking-wide">
                  <Icon className="h-3.5 w-3.5" />
                  {text}
                  <span className="ml-4 h-1 w-1 rounded-full bg-white/50" />
                </span>
              ))}
            </span>
          ))}
        </span>
        <span aria-hidden="true" className="hidden h-full items-center justify-center gap-2 text-xs font-semibold motion-reduce:flex">
          <Heart className="h-3.5 w-3.5" />
          Seja apoiador do Cinelume
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </a>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Retomar mensagens de apoio" : "Pausar mensagens de apoio"}
        className="flex h-7 w-8 shrink-0 items-center justify-center border-l border-white/20 bg-black/10 transition-colors hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white motion-reduce:hidden"
      >
        {paused ? <Play className="h-3 w-3" aria-hidden="true" /> : <Pause className="h-3 w-3" aria-hidden="true" />}
      </button>
    </div>
  );
}
