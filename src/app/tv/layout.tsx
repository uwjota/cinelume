import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "TV ao vivo",
  description: "Consulte canais e programação de TV ao vivo no Cinelume.",
  path: "/tv",
});

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
