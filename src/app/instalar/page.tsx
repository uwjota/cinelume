import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Download, Globe, PlusSquare, Share, Smartphone } from "lucide-react";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Instalar aplicativo",
  description: "Leve o Cinelume para a tela inicial do iPhone ou baixe o aplicativo Android em APK. Veja o passo a passo de instalação.",
  path: "/instalar",
});

const iosSteps = [
  { title: "Abra o Cinelume no Safari", text: "No iPhone, acesse este site pelo Safari. Se estiver em um navegador dentro de outro app, copie o endereço e abra no Safari.", icon: Globe },
  { title: "Toque em Compartilhar", text: "Procure o ícone do quadrado com uma seta para cima. Dependendo da versão do iOS, ele fica dentro do menu Mais do Safari.", icon: Share },
  { title: "Escolha Adicionar à Tela de Início", text: "Role a lista de ações para encontrar essa opção. Se ela não aparecer, toque em Editar Ações e adicione-a.", icon: PlusSquare },
  { title: "Confirme e pronto", text: "Mantenha o nome Cinelume e, se aparecer, ative Abrir como App da Web. Toque em Adicionar e abra pelo novo ícone na tela inicial.", icon: Check },
];

const androidSteps = [
  { title: "Baixe o APK", text: "Toque em Baixar APK neste celular Android e aguarde o download do arquivo Cinelume.apk." },
  { title: "Abra o arquivo baixado", text: "Toque no download concluído no navegador ou encontre Cinelume.apk na pasta Downloads do celular." },
  { title: "Autorize a instalação, se solicitado", text: "Caso o Android peça, abra Configurações nessa mensagem e permita a instalação de apps dessa fonte para o navegador ou gerenciador de arquivos usado." },
  { title: "Instale e abra o Cinelume", text: "Volte ao instalador, toque em Instalar e depois em Abrir. O aplicativo também ficará na lista de apps do celular." },
];

export default function InstalarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-24 md:px-6 md:pt-28 lg:px-8">
      <section className="border-b border-cine-border pb-8">
        <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Instale o Cinelume</h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cine-text-secondary">Adicione à tela inicial do iPhone ou baixe o aplicativo para Android.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#ios" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-cine-bg transition-colors hover:bg-zinc-200"><Smartphone className="h-4 w-4" aria-hidden="true" />Instalar no iPhone<ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
              <a href="#android" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-cine-border bg-cine-surface-elevated px-5 py-3 text-sm font-bold text-white transition-colors hover:border-cine-brand"><Download className="h-4 w-4" aria-hidden="true" />Baixar para Android<ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
            </div>
          </div>
          <div className="shrink-0">
            <Image src="/icons/icon-512.png" alt="Cinelume" width={96} height={96} priority className="h-16 w-16 rounded-2xl sm:h-24 sm:w-24" />
          </div>
        </div>
      </section>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
        <section id="ios" aria-labelledby="ios-title" className="scroll-mt-32 rounded-2xl border border-cine-border bg-cine-surface p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5"><Smartphone className="h-6 w-6" aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold uppercase tracking-widest text-cine-text-muted">iOS · Safari</p><h2 id="ios-title" className="mt-1 text-2xl font-bold">No seu iPhone</h2></div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-cine-text-secondary">Adicione o site à tela inicial para abrir o Cinelume como um aplicativo, direto pelo Safari.</p>
          <ol className="mt-8 space-y-7">
            {iosSteps.map(({ title, text, icon: Icon }, index) => (
              <li key={title} className="flex gap-4">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cine-border text-xs font-bold text-cine-text-secondary">{index + 1}</span>
                <div className="min-w-0"><h3 className="flex items-start gap-2 text-sm font-semibold"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-cine-brand" aria-hidden="true" />{title}</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">{text}</p></div>
              </li>
            ))}
          </ol>
          <a href="https://support.apple.com/pt-br/guide/iphone/iphea86e5236/ios" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-cine-text-secondary underline decoration-cine-border underline-offset-4 hover:text-white">Ver guia da Apple<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
        </section>

        <section id="android" aria-labelledby="android-title" className="scroll-mt-32 rounded-2xl border border-cine-brand/25 bg-cine-surface p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cine-brand/10"><Download className="h-6 w-6 text-cine-brand" aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold uppercase tracking-widest text-cine-text-muted">Android · APK</p><h2 id="android-title" className="mt-1 text-2xl font-bold">No seu Android</h2></div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-cine-text-secondary">Baixe o arquivo de instalação do Cinelume e instale no seu celular com Android 8.0 ou superior.</p>
          <a href="/downloads/Cinelume.apk" download="Cinelume.apk" className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cine-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-cine-brand-hover"><Download className="h-5 w-5" aria-hidden="true" />Baixar APK</a>
          <p className="mt-3 text-center text-xs text-cine-text-muted">Versão 1.0.2 · Versão de teste · APK para Android</p>
          <ol className="mt-8 space-y-7">
            {androidSteps.map(({ title, text }, index) => (
              <li key={title} className="flex gap-4">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cine-brand/20 bg-cine-brand/10 text-xs font-bold text-cine-brand">{index + 1}</span>
                <div className="min-w-0"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">{text}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-cine-border pt-5 text-xs leading-relaxed text-cine-text-muted">Os nomes das opções podem variar conforme o celular. Depois de instalar, você pode desativar a permissão dessa fonte. Se o sistema bloquear a instalação, confira a mensagem exibida e as <a href="https://support.google.com/pixelphone/answer/7391672?hl=pt-BR" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">orientações do Android<span className="sr-only"> (abre em nova aba)</span></a>.</p>
        </section>
      </div>

      <section aria-labelledby="questions-title" className="mt-10">
        <h2 id="questions-title" className="text-xl font-bold">Dúvidas comuns</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-cine-border p-5"><h3 className="text-sm font-semibold">Preciso de internet?</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">Sim. O catálogo e a reprodução precisam de uma conexão com a internet.</p></div>
          <div className="rounded-xl border border-cine-border p-5"><h3 className="text-sm font-semibold">O APK funciona no iPhone?</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">O APK é exclusivo para Android. No iPhone, siga os passos do Safari para adicionar o site à tela inicial.</p></div>
          <div className="rounded-xl border border-cine-border p-5"><h3 className="text-sm font-semibold">Minha lista vai junto?</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">Os dados ficam no navegador ou app em que foram salvos. Não há sincronização automática entre eles.</p></div>
          <div className="rounded-xl border border-cine-border p-5"><h3 className="text-sm font-semibold">Posso encontrar anúncios?</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">Ao usar o site ou o Cinelume no iPhone/iOS, podem aparecer anúncios aleatórios durante a navegação. No APK para Android, esses anúncios são bloqueados.</p></div>
          <div className="rounded-xl border border-cine-brand/25 bg-cine-brand/5 p-5"><h3 className="text-sm font-semibold">O Cinelume está estável?</h3><p className="mt-2 text-sm leading-relaxed text-cine-text-secondary">O Cinelume é novo e pode apresentar instabilidades ou mudanças enquanto seguimos melhorando a experiência.</p></div>
        </div>
      </section>
      <div className="mt-10 text-center"><Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cine-text-secondary transition-colors hover:text-white">Explorar o catálogo<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link></div>
    </div>
  );
}
