import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Radio, Tv } from "lucide-react";
import { LivePlayer } from "@/components/player";
import { ChannelCard } from "@/components/tv";
import { liveTvService } from "@/services/live-tv/live-tv.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const channel = await liveTvService.getChannelById(id);

  return channel
    ? createPageMetadata({
        title: `${channel.name} ao vivo`,
        description: channel.description || `Veja a programação de ${channel.name} no Cinelume.`,
        path: `/tv/${channel.id}`,
        image: channel.logo,
      })
    : createPageMetadata({
        title: "Canal não encontrado",
        description: "Este canal não está disponível no Cinelume.",
        path: `/tv/${id}`,
        noIndex: true,
      });
}

function formatProgrammeTime(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const channel = await liveTvService.getChannelById(id);
  if (!channel) notFound();

  const relatedChannels = (await liveTvService.getChannels(channel.category))
    .filter((item) => item.id !== channel.id)
    .slice(0, 4);

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-4 pb-16 pt-20 md:px-6 md:pt-24 lg:px-8">
      <Link href="/tv" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-cine-text-secondary transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar para TV ao Vivo
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <LivePlayer
          title={`${channel.name} ao vivo`}
          sources={channel.embedUrl ? [{ id: channel.id, url: channel.embedUrl }] : []}
        />

        <aside className="flex flex-col gap-5 rounded-2xl border border-cine-border bg-cine-surface p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-24 shrink-0 items-center justify-center rounded-xl border border-cine-border bg-black/30 p-3">
              {channel.logo ? (
                <Image src={channel.logo} alt={channel.name} fill sizes="96px" className="object-contain p-3" unoptimized />
              ) : (
                <Tv className="h-8 w-8 text-cine-text-muted" />
              )}
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400"><Radio className="h-3 w-3" /> AO VIVO</span>
              <h1 className="truncate text-xl font-extrabold text-white">{channel.name}</h1>
              <p className="text-xs text-cine-text-muted">{channel.category}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cine-text-muted">Agora no ar</p>
            <p className="mt-1 text-sm font-medium text-white">{channel.nowPlaying || "Programação ao vivo"}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-cine-brand" style={{ width: `${Math.min(Math.max(channel.progress ?? 0, 0), 100)}%` }} />
            </div>
          </div>

          {channel.description && <p className="text-sm leading-relaxed text-cine-text-secondary">{channel.description}</p>}

          {channel.nextProgrammes && channel.nextProgrammes.length > 0 && (
            <div className="border-t border-cine-border pt-4">
              <h2 className="mb-3 text-sm font-bold text-white">A seguir</h2>
              <div className="flex flex-col gap-3">
                {channel.nextProgrammes.slice(0, 4).map((programme, index) => (
                  <div key={`${programme.title}-${index}`} className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cine-brand" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-white">{programme.title}</p>
                      <p className="text-[10px] text-cine-text-muted">{formatProgrammeTime(programme.start)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {relatedChannels.length > 0 && (
        <section className="flex flex-col gap-4 pt-4">
          <h2 className="text-xl font-bold text-white">Mais em {channel.category}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedChannels.map((item) => <ChannelCard key={item.id} channel={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
