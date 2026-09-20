import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LivePlayer } from "@/components/player";
import { EventCard } from "@/components/sports";
import { eventsService } from "@/services/events/events.service";
import { createPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await eventsService.getEventById(id);

  return event
    ? createPageMetadata({
        title: event.title,
        description: event.description || `Acompanhe ${event.title} no Cinelume.`,
        path: `/esportes/${event.id}`,
        image: event.poster,
      })
    : createPageMetadata({
        title: "Evento não encontrado",
        description: "Este evento não está disponível no Cinelume.",
        path: `/esportes/${id}`,
        noIndex: true,
      });
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await eventsService.getEventById(id);
  if (!event) notFound();

  const related = (await eventsService.getEvents(event.sport))
    .filter((item) => item.id !== event.id)
    .slice(0, 4);
  const playable = event.status !== "finished" && event.streams.length > 0;

  return (
    <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-4 pb-16 pt-20 md:px-6 md:pt-24 lg:px-8">
      <Link href="/esportes" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-cine-text-secondary transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar para Esportes
      </Link>

      {playable ? (
        <LivePlayer
          title={event.title}
          sources={event.streams.map((stream, index) => ({
            id: `${stream.id}-${index}`,
            url: stream.url,
            quality: stream.quality,
          }))}
        />
      ) : (
        <div className="rounded-2xl border border-cine-border bg-cine-surface">
          <EmptyState
            icon={<Trophy className="mb-4 h-12 w-12 text-cine-brand" />}
            message={event.status === "finished" ? "Este evento já foi encerrado." : "A transmissão ainda não foi disponibilizada pelo provider."}
          />
        </div>
      )}

      {related.length > 0 && (
        <section className="flex flex-col gap-4 pt-4">
          <h2 className="text-xl font-bold text-white">Mais eventos de {event.sport}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <EventCard key={item.id} event={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
