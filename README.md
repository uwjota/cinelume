# Cinelume

<p align="center">
  <img src="public/branding/cinelume_wordmark.png" alt="Cinelume" width="180" />
</p>

O Cinelume é uma aplicação web responsiva para descoberta e reprodução de filmes, séries, animes, doramas, TV ao vivo e eventos esportivos. O projeto foi construído com Next.js, TypeScript e Tailwind CSS, com foco em navegação rápida, experiência mobile e instalação como PWA.

## Recursos

- Home com Hero responsivo, carrosséis e conteúdo em destaque.
- Catálogos separados de filmes, séries, animes e doramas.
- Filtros por gênero e ordenação por popularidade, avaliação, ano ou título.
- Paginação incremental com o botão **Carregar mais**.
- Pesquisa paginada de filmes e séries.
- Páginas de detalhes com elenco, temporadas, episódios, recomendações e trailers.
- Player com seleção de servidor e navegação entre episódios.
- Seção **Continuar assistindo** com episódio e progresso armazenados localmente.
- Favoritos, histórico, pesquisas recentes e preferências salvos no navegador.
- TV ao vivo e eventos esportivos.
- Layout adaptado para celular, tablet e desktop.
- PWA com manifest, service worker, tela offline e ícones próprios.
- Estados de carregamento, skeletons, páginas de erro e navegação acessível por teclado.

## Tecnologias

- [Next.js](https://nextjs.org/) 15 com App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Dexie](https://dexie.org/) e IndexedDB
- [Zod](https://zod.dev/)
- [Lucide React](https://lucide.dev/)

## Requisitos

- Node.js 20 ou superior recomendado.
- npm 10 ou superior.
- Uma chave da API do TMDB ou um token de leitura do TMDB para obter o catálogo completo.

Sem credenciais do TMDB, a aplicação utiliza um conjunto local reduzido de dados para fallback.

## Instalação

```bash
git clone https://github.com/uwjota/cinelume.git
cd cinelume
npm install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Preencha pelo menos uma das credenciais do TMDB e inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL pública usada pelos metadados, sitemap e compartilhamento. |
| `TMDB_API_KEY` | Condicional | Chave v3 da API do TMDB. Use esta variável ou `TMDB_ACCESS_TOKEN`. |
| `TMDB_ACCESS_TOKEN` | Condicional | Token de leitura v4 do TMDB. Use esta variável ou `TMDB_API_KEY`. |
| `NEXT_PUBLIC_METADATA_IMAGE_BASE_URL` | Não | Base das imagens do catálogo. O padrão é `https://image.tmdb.org/t/p`. |
| `NEXT_PUBLIC_SUPERFLIX_PLAYER_URL` | Não | URL base do primeiro servidor de reprodução. |
| `NEXT_PUBLIC_WAREZCDN_PLAYER_URL` | Não | URL base do segundo servidor de reprodução. |
| `NEXT_PUBLIC_LIVE_PROVIDER_URL` | Não | Endpoint do provedor de TV e eventos ao vivo. |

Nunca envie `.env.local` ao repositório. O arquivo já está protegido pelo `.gitignore`.

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a build otimizada de produção. |
| `npm run start` | Inicia a build de produção. |
| `npm run lint` | Executa o ESLint no projeto. |
| `npm run typecheck` | Valida os tipos sem gerar arquivos. |

Para iniciar a produção em uma porta específica:

```bash
npm run build
npm run start -- -p 3010
```

## Rotas principais

| Rota | Conteúdo |
| --- | --- |
| `/` | Home e seções personalizadas. |
| `/filmes` | Catálogo e filtros de filmes. |
| `/series` | Catálogo e filtros de séries. |
| `/animes` | Catálogo de animações japonesas. |
| `/doramas` | Catálogo de produções sul-coreanas. |
| `/buscar` | Pesquisa paginada. |
| `/filme/[id]` | Detalhes de um filme. |
| `/serie/[id]` | Detalhes, temporadas e episódios de uma série. |
| `/anime/[id]` | Detalhes e episódios de um anime. |
| `/dorama/[id]` | Detalhes e episódios de um dorama. |
| `/assistir/filme/[id]` | Player de filmes. |
| `/assistir/serie/[id]` | Player de episódios. |
| `/tv` | Canais ao vivo. |
| `/esportes` | Eventos esportivos. |
| `/minha-lista` | Títulos favoritos. |
| `/configuracoes` | Servidor padrão, histórico e dados locais. |

## APIs internas

- `GET /api/catalog`: catálogo paginado por tipo, gênero e ordenação.
- `GET /api/search`: pesquisa paginada no catálogo.
- `GET /api/series/[id]/seasons/[season]`: episódios reais de uma temporada.
- `GET /api/proxy`: proxy restrito por allowlist para provedores autorizados.

## Estrutura do projeto

```text
src/
├── app/          # Rotas, páginas e endpoints do App Router
├── components/   # Layout, mídia, player, feedback e componentes de domínio
├── config/       # Filtros e configuração central dos provedores
├── hooks/        # Hooks de consulta e armazenamento local
├── lib/          # Banco local, HTTP, validação, SEO e TanStack Query
├── providers/    # Integrações externas e adaptação de respostas
├── services/     # Regras de catálogo, busca, reprodução e persistência
├── types/        # Tipos compartilhados
└── utils/        # Formatação e utilitários de mídia
```

O projeto separa os provedores externos dos serviços de domínio. As respostas são validadas, adaptadas para os tipos internos e consumidas pelas páginas e componentes.

## Dados locais e privacidade

Favoritos, histórico, progresso de reprodução, pesquisas recentes e configurações são armazenados no IndexedDB do próprio navegador. Esses dados não são enviados pelo Cinelume para um banco de dados próprio e podem ser apagados pela tela de configurações.

O progresso exibido pelo Cinelume é registrado localmente. Como os vídeos são executados em iframes de terceiros, a retomada automática em um segundo exato depende do suporte oferecido pelo servidor selecionado.

## PWA e cache

O manifest fica em `src/app/manifest.ts` e o service worker em `public/sw.js`. O cache do shell permite exibir a tela offline quando a rede não está disponível. Sempre altere a versão do cache no service worker ao mudar arquivos estáticos importantes.

## Segurança

- Segredos do TMDB são lidos somente no servidor.
- O proxy aceita apenas domínios presentes na allowlist.
- URLs de reprodução são validadas pelo registro de provedores.
- A aplicação envia cabeçalhos de proteção de conteúdo, referência e permissões.
- Arquivos `.env`, builds e dependências não são versionados.

## Deploy

### Vercel

1. Importe o repositório no painel da Vercel.
2. Cadastre as variáveis da seção **Variáveis de ambiente**.
3. Mantenha o framework detectado como Next.js.
4. Execute o deploy.

### Servidor Node.js

```bash
npm ci
npm run build
npm run start -- -p 3010
```

Configure um proxy reverso com HTTPS para expor a porta da aplicação em produção.

## Verificação antes do deploy

```bash
npm run lint
npm run typecheck
npm run build
```

Revise também os fluxos de pesquisa, filtros, carregamento adicional, detalhes, episódios, player, favoritos e responsividade nos principais tamanhos de tela.

## Provedores e responsabilidade de uso

O Cinelume não hospeda arquivos de vídeo. Metadados, imagens e reprodução dependem de serviços externos configurados pelo responsável pela instalação. Verifique os termos, licenças e permissões aplicáveis antes de disponibilizar uma instância publicamente.

## Licença

Nenhuma licença de código aberto foi definida neste repositório. Todos os direitos permanecem com o autor do projeto.
