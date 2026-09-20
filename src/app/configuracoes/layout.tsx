import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Configurações",
  description: "Preferências e dados locais do Cinelume neste dispositivo.",
  path: "/configuracoes",
  noIndex: true,
});

export default function ConfiguracoesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
