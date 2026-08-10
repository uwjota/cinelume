# CineLume

Versão web do CineLume, com a mesma experiência visual do aplicativo Android:
filmes, séries, animes, doramas, TV ao vivo, busca e uma lista pessoal salva no navegador.

## Recursos

- Catálogo atualizado por API, com atualização sob demanda e cache curto;
- Pesquisa por título e filtros por tipo de conteúdo;
- TV ao vivo organizada por categoria;
- Minha lista e histórico de reprodução locais;
- Interface responsiva que replica o visual preto, dourado e compacto do APK;
- Logo e ícone oficiais do CineLume.

## Rodar localmente

Requer Node.js 22 ou superior.

```bash
pnpm install
pnpm dev
```

Para validar a produção:

```bash
pnpm build
```

O catálogo e os canais são consultados por rotas internas em `app/api/`, assim o navegador não depende de CORS do provedor.

## Publicar na Vercel

Importe o repositório no painel da Vercel e mantenha a configuração detectada do projeto. O arquivo `vercel.json` já instrui a plataforma a executar `next build`; não há variáveis de ambiente obrigatórias.

## Aviso sobre reprodução

O CineLume incorpora o player fornecido pelo parceiro de conteúdo. Caso o parceiro exija abertura externa ou bloqueie a incorporação, o site mostra a opção de abrir a página dele — sem tentar contornar essa proteção.
