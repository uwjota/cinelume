Rei dos Embeds
Início
Agenda
Guia de TV
API Docs
API Docs
Documentação das rotas públicas de canais, eventos, categorias e guia de programação.

Base
Base da API que entrega os dados.

Copiar
GET https://reidosembeds.online/api
Listar todos canais
Lista todos os canais disponíveis.

Copiar
GET https://reidosembeds.online/api/channels
Canal por ID
Retorna um canal específico pelo ID público.

Copiar
GET https://reidosembeds.online/api/channels/amc
Categorias de canais
Lista as categorias de canais.

Copiar
GET https://reidosembeds.online/api/channels/categories
Canais por categoria
Filtra canais pela categoria informada.

Copiar
GET https://reidosembeds.online/api/channels?category=Noticias
Listar eventos
Lista os eventos esportivos.

Copiar
GET https://reidosembeds.online/api/eventos
Evento específico
Retorna um evento específico por ID.

Copiar
GET https://reidosembeds.online/api/eventos/palmeiras-x-gremio
Categorias de eventos
Lista as categorias de eventos esportivos.

Copiar
GET https://reidosembeds.online/api/eventos/categories
Eventos por esporte/status
Filtra eventos por categoria e status. Suporta futebol, basquete, beisebol, hóquei, vôlei, rugby, MMA e golfe; eventos sem dois times usam visual_model=event.

Copiar
GET https://reidosembeds.online/api/eventos?category=Futebol&status=live
Pesquisa global
Pesquisa global entre canais e eventos.

Copiar
GET https://reidosembeds.online/api/pesquisa?q=gremio
Guia dos canais
Guia de programação dos canais em XMLTV. Atualizado a cada 24h.

Copiar
GET https://reidosembeds.online/api/guia
Exemplos de Resposta
Evento
{
    "success": true,
    "data": [
        {
            "id": "san-diego-wave-x-kansas-city-current-18-09-2026-23-00",
            "channel_site_id": 5,
            "post_id": 7666,
            "title": "San Diego Wave x Kansas City Current",
            "description": "San Diego Wave enfrenta Kansas City Current pelo NWSL, com informações de horário, canais e detalhes para acompanhar o jogo. Transmissão por Canal Goat, Canal Goat 2, Canal Goat 3. Programado para 18/09/2026 às 23:00 no Brasil e 19/09/2026 às 03:00 em Portugal.",
            "poster": "https://reidosembeds.online/img/bg/bg-post-event.png",
            "time1": "https://reidosembeds.online/img/team/7262.png",
            "time2": "https://reidosembeds.online/img/team/4189.png",
            "time1_name": "San Diego Wave",
            "time2_name": "Kansas City Current",
            "visual_model": "versus",
            "event_logo": "",
            "competition_logo": "",
            "sport_key": "football",
            "start_time": "2026-09-18 23:00:00",
            "end_time": "",
            "status": "upcoming",
            "category": "Futebol",
            "competition": "NWSL",
            "slug": "san-diego-wave-x-kansas-city-current-18-09-2026-23-00",
            "base_public_slug": "san-diego-wave-x-kansas-city-current",
            "public_slug": "san-diego-wave-x-kansas-city-current",
            "page_url": "https://reidosembeds.online/eventos/san-diego-wave-x-kansas-city-current",
            "play_event_url": "https://v1.rdembed.sbs/e/san-diego-wave-x-kansas-city-current",
            "has_youtube_live": false,
            "youtube_scan": {
                "status": "",
                "message": "",
                "checked_at": ""
            },
            "embeds": [
                {
                    "provider": "Canal Goat",
                    "quality": "HD",
                    "slug": "canalgoat",
                    "logo": "https://reidosembeds.online/img/canalgoat.png",
                    "embed_url": "https://v1.rdembed.sbs/canalgoat"
                },
                {
                    "provider": "Canal Goat 2",
                    "quality": "HD",
                    "slug": "canalgoat2",
                    "logo": "https://reidosembeds.online/img/canalgoat2.png",
                    "embed_url": "https://v1.rdembed.sbs/canalgoat2"
                },
                {
                    "provider": "Canal Goat 3",
                    "quality": "HD",
                    "slug": "canalgoat3",
                    "logo": "https://reidosembeds.online/img/canalgoat3.png",
                    "embed_url": "https://v1.rdembed.sbs/canalgoat3"
                }
            ]
        }
    ],
    "total": 1
}
Canal
{
    "success": true,
    "data": {
        "id": "ae",
        "name": "A&E",
        "description": "",
        "logo_url": "https://reidosembeds.online/img/ae.png",
        "preview_url": "https://in-escambo-casas-8k9.ondeencontrarhomem.lat/ae/preview.jpg",
        "embed_url": "https://v1.rdembed.sbs/ae",
        "category": "Variedades",
        "is_active": true,
        "now_playing_title": "Polícia Em Ação",
        "now_playing_progress": 66,
        "now_playing_has_guide": true,
        "now_playing_next_programmes": [
            {
                "title": "As Primeiras 48 Horas",
                "start": "2026-09-18T08:45:00-03:00",
                "end": "2026-09-18T09:35:00-03:00",
                "start_timestamp": 1789731900,
                "end_timestamp": 1789734900
            },
            {
                "title": "Casos Arquivados",
                "start": "2026-09-18T09:35:00-03:00",
                "end": "2026-09-18T10:25:00-03:00",
                "start_timestamp": 1789734900,
                "end_timestamp": 1789737900
            },
            {
                "title": "Casos Arquivados",
                "start": "2026-09-18T10:25:00-03:00",
                "end": "2026-09-18T11:15:00-03:00",
                "start_timestamp": 1789737900,
                "end_timestamp": 1789740900
            },
            {
                "title": "Acumuladores Compulsivos",
                "start": "2026-09-18T11:15:00-03:00",
                "end": "2026-09-18T12:05:00-03:00",
                "start_timestamp": 1789740900,
                "end_timestamp": 1789743900
            },
            {
                "title": "Acumuladores Compulsivos",
                "start": "2026-09-18T12:05:00-03:00",
                "end": "2026-09-18T12:55:00-03:00",
                "start_timestamp": 1789743900,
                "end_timestamp": 1789746900
            }
        ]
    }
}

Categorias
{
    "success": true,
    "data": [
        {
            "id": "24-horas",
            "name": "24 Horas"
        },
        {
            "id": "a-fazenda",
            "name": "A Fazenda"
        },
        {
            "id": "adulto",
            "name": "Adulto"
        },
        {
            "id": "animes",
            "name": "Animes"
        },
        {
            "id": "canais-abertos",
            "name": "Canais Abertos"
        },
        {
            "id": "desenhos",
            "name": "Desenhos"
        },
        {
            "id": "documentarios",
            "name": "Documentários"
        },
        {
            "id": "esportes",
            "name": "Esportes"
        },
        {
            "id": "filmes",
            "name": "Filmes"
        },
        {
            "id": "globo",
            "name": "Globo"
        },
        {
            "id": "gospel",
            "name": "Gospel"
        },
        {
            "id": "infantil",
            "name": "Infantil"
        },
        {
            "id": "ingles",
            "name": "Inglês"
        },
        {
            "id": "internacionais",
            "name": "Internacionais"
        },
        {
            "id": "miamitv",
            "name": "MiamiTV"
        },
        {
            "id": "noticias",
            "name": "Notícias"
        },
        {
            "id": "realitys",
            "name": "Realitys"
        },
        {
            "id": "series",
            "name": "Séries"
        },
        {
            "id": "variedades",
            "name": "Variedades"
        }
    ],
    "total": 19
}
Pesquisa
{
    "success": true,
    "data": {
        "channels": [],
        "events": [
            {
                "id": "botafogo-x-gremio-16-09-2026-19-30",
                "channel_site_id": 5,
                "post_id": 7589,
                "title": "Botafogo x Grêmio",
                "description": "Botafogo enfrenta Grêmio pelo BRASILEIRÃO SÉRIE A, com informações de horário, canais e detalhes para acompanhar o jogo. Transmissão por Premiere 1, Premiere 2, Premiere 3, Premiere 4, Premiere 5, Premiere 6, Premiere 7, Premiere 8. Programado para 16/09/2026 às 19:30 no Brasil e 16/09/2026 às 23:30 em Portugal.",
                "poster": "https://reidosembeds.online/img/bg/bg-post-event.png",
                "time1": "https://reidosembeds.online/img/team/134285.png",
                "time2": "https://reidosembeds.online/img/team/134288.png",
                "time1_name": "Botafogo",
                "time2_name": "Grêmio",
                "visual_model": "versus",
                "event_logo": "",
                "competition_logo": "",
                "sport_key": "football",
                "start_time": "2026-09-16 19:30:00",
                "end_time": "",
                "status": "finished",
                "category": "Futebol",
                "competition": "BRASILEIRÃO SÉRIE A",
                "slug": "botafogo-x-gremio-16-09-2026-19-30",
                "base_public_slug": "botafogo-x-gremio",
                "public_slug": "botafogo-x-gremio",
                "page_url": "https://reidosembeds.online/eventos/botafogo-x-gremio",
                "play_event_url": "https://v1.rdembed.sbs/e/botafogo-x-gremio",
                "has_youtube_live": false,
                "youtube_scan": {
                    "status": "not_found",
                    "message": "Nenhuma transmissão do YouTube encontrada em 16/09/2026 para Arkema Première Ligue usando: Botafogo, Grêmio.",
                    "checked_at": "2026-09-15 21:41:46"
                },
                "embeds": [
                    {
                        "provider": "Premiere 1",
                        "quality": "HD",
                        "slug": "premiere",
                        "logo": "https://reidosembeds.online/img/premiere.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere"
                    },
                    {
                        "provider": "Premiere 2",
                        "quality": "HD",
                        "slug": "premiere-2",
                        "logo": "https://reidosembeds.online/img/premiere-2.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-2"
                    },
                    {
                        "provider": "Premiere 3",
                        "quality": "HD",
                        "slug": "premiere-3",
                        "logo": "https://reidosembeds.online/img/premiere-3.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-3"
                    },
                    {
                        "provider": "Premiere 4",
                        "quality": "HD",
                        "slug": "premiere-4",
                        "logo": "https://reidosembeds.online/img/premiere-4.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-4"
                    },
                    {
                        "provider": "Premiere 5",
                        "quality": "HD",
                        "slug": "premiere-5",
                        "logo": "https://reidosembeds.online/img/premiere-5.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-5"
                    },
                    {
                        "provider": "Premiere 6",
                        "quality": "HD",
                        "slug": "premiere-6",
                        "logo": "https://reidosembeds.online/img/premiere-6.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-6"
                    },
                    {
                        "provider": "Premiere 7",
                        "quality": "HD",
                        "slug": "premiere-7",
                        "logo": "https://reidosembeds.online/img/premiere-7.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-7"
                    },
                    {
                        "provider": "Premiere 8",
                        "quality": "HD",
                        "slug": "premiere-8",
                        "logo": "https://reidosembeds.online/img/premiere-8.png",
                        "embed_url": "https://v1.rdembed.sbs/premiere-8"
                    }
                ]
            }
        ]
    },
    "meta": {
        "query": "gremio",
        "total_channels": 0,
        "total_events": 1,
        "total_results": 1
    }
}
Copiar

Códigos de Status HTTP
200
Sucesso
400
Requisição inválida
404
Recurso não encontrado
500
Erro interno do servidor
Rei dos Embeds
Aviso legal: Este site não hospeda e não armazena nenhum arquivo em seus servidores. Indexamos apenas mídia hospedada em serviços de terceiros.

© 2026 Rei dos Embeds. Todos os direitos reservados.