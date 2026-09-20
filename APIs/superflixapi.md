
Pesquisar


Documentação
Geral
Introdução
Telegram
Endpoint /lista
Gêneros
Guia XMLTV
Calendário
Conteúdo
Filmes
Séries & Animes
Temporadas
Episódios
Integração
Plugin Javascript
Plugin PHP
Personalização
Plugin Dooplay
Documentação Técnica
A API do SuperFlixAPI foi projetada para facilitar a integração de conteúdo multimídia em qualquer plataforma. Nossa solução oferece endpoints RESTful simples, rápidos e documentados para acesso a filmes, séries, animes e doramas.

Grupo no Telegram
Acompanhe avisos, atualizações e suporte pelo grupo oficial deste domínio.

Acessar grupo do Telegram
Endpoint: /lista
Use o endpoint /lista para consultar listas públicas no domínio atual da API. Ele pode retornar IDs de catálogo, canais, categorias de canais, eventos esportivos e pesquisa global. Todos os links e imagens são entregues já apontando para o próprio domínio que recebeu a requisição.

https://superflixapi.quest/lista?category=animes&type=tmdb&format=json&order=asc
Parâmetros principais
Parâmetro	Obrigatório?	Uso
category	Sim	Define o recurso desejado. Aceita: filme, movie, serie, series, anime, animes, dorama, doramas, canal, canais, channel, channels, evento, eventos, event, events, channel_categories, event_categories e guia, pesquisa, busca e search.
format	Não	Formato da resposta: json ou html (padrão).
type	Não	Usado nas listas de catálogo para escolher o ID externo: tmdb (padrão) ou imdb.
Uso
Você pode usar variações do mesmo termo em category para consultar o mesmo recurso.
Catálogo: filmes, séries, animes e doramas
Use esta categoria para obter listas de IDs do catálogo. Aceita filmes, séries, animes e doramas, retornando os IDs na ordem solicitada.
https://superflixapi.quest/lista?category=animes&format=json
https://superflixapi.quest/lista?category=filme&type=imdb&format=json
https://superflixapi.quest/lista?category=serie&type=tmdb&order=asc&format=json
https://superflixapi.quest/lista?category=dorama&format=html
Guia de programação XMLTV
Guia de programação dos canais em XMLTV, atualizado a cada 24h.
https://superflixapi.quest/lista?category=guia
Canais
Use esta categoria para obter a lista pública de canais com dados de navegação, reprodução e filtros.
https://superflixapi.quest/lista?category=canais&format=json
https://superflixapi.quest/lista?category=canais&q=sportv&format=json
https://superflixapi.quest/lista?category=canais&genre=esportes&limit=20&format=json
Categorias de canais
Use esta categoria para obter as categorias públicas disponíveis para navegação de canais.
https://superflixapi.quest/lista?category=channel_categories&format=json
Eventos esportivos
Retorna eventos esportivos disponíveis na agenda, com horário, competição, modalidade, imagens, status e canais vinculados. O campo page_url abre o evento em /eventos/{slug}; play_event_url aponta para o mesmo player do evento já preparado com todos os canais relacionados. Eventos com modelo visual único podem trazer visual_model=event, event_logo e competition_logo.
https://superflixapi.quest/lista?category=eventos&format=json
https://superflixapi.quest/lista?category=eventos&sport=futebol&format=json
https://superflixapi.quest/lista?category=eventos&sport=golfe&format=json
https://superflixapi.quest/lista?category=eventos&status=live&limit=10&format=json
https://superflixapi.quest/lista?category=eventos&q=flamengo&format=json
Categorias de eventos
Use esta categoria para obter as categorias e agrupamentos usados pelos eventos esportivos.
https://superflixapi.quest/lista?category=event_categories&format=json
Pesquisa
Use esta categoria para fazer busca pública unificada em conteúdos disponíveis no domínio atual, incluindo canais e eventos.
https://superflixapi.quest/lista?category=pesquisa&q=gremio&format=json
https://superflixapi.quest/lista?category=busca&q=espn&limit=15&format=json
Dica: use format=json quando for integrar o endpoint em aplicativos, painéis, agregadores ou automações.@if($apiChannelsEnabled) Para eventos, combine sport, status, q e limit para respostas mais específicas.@endif
Gêneros em /lista
Listar gêneros
https://superflixapi.quest/lista?category=filme&type=generos&format=json
https://superflixapi.quest/lista?category=serie&type=generos&format=json
https://superflixapi.quest/lista?category=anime&type=generos&format=json
https://superflixapi.quest/lista?category=dorama&type=generos&format=json
Listar IDs por gênero
https://superflixapi.quest/lista?category=filme&type=imdb&genero=acao&format=json
https://superflixapi.quest/lista?category=serie&type=tmdb&genero=drama&format=json
https://superflixapi.quest/lista?category=anime&type=tmdb&genero=shounen&format=json
https://superflixapi.quest/lista?category=dorama&type=tmdb&genero=romance&format=json
Categoria	Fonte	Parâmetro
filme	genres	genero
serie	genres	genero
anime	anime_genres	genero
dorama	genres	genero
API de Calendário
Dados em tempo real sobre episódios lançados recentemente ou previstos. Retorna um JSON Array.

https://superflixapi.quest/calendario.php
Filmes
Acesse filmes via ID do IMDb (iniciado com tt) ou ID numérico do TMDB.

https://superflixapi.quest/filme/ID_DO_FILME
Exemplo: /filme/tt0068646

Séries, Animes e Doramas
O endpoint /serie/ é unificado. Ele funciona para Séries, Animes e Doramas sem distinção.

https://superflixapi.quest/serie/ID_TMDB
Exemplo: /serie/1396

Navegação por Episódios
Temporada Específica
Episódio Específico
Plugin JavaScript
Copie este código e cole no seu site para integrar o player automaticamente.

<div id="PlayerContainer"></div>
<script>
    var type = "serie";
    var id = "1396";
    var season = "1";
    var episode = "1";

    function EmbedPlayer(t,i,s,e){
        if(t=="filme"){s="";e=""}
        var f=document.getElementById("PlayerContainer");
        var u="https://superflixapi.quest/"+t+"/"+i+"/"+s+"/"+e;
        u = u.replace(/([^:])(\/{2,})/, "$1/");
        f.innerHTML='<iframe src="'+u+'" width="100%" height="100%" frameborder="0" allow="autoplay *; encrypted-media *; picture-in-picture *; fullscreen *; clipboard-write *; accelerometer *; gyroscope *; web-share *" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
    }
    EmbedPlayer(type,id,season,episode);
</script>
Plugin PHP
<div id="PlayerContainer">
<?php
    $type = "serie";
    $id = "1396";
    $season = "1";
    $episode = "1";

    function RenderPlayer($t, $i, $s, $e) {
        if ($t == "filme") { $s = ""; $e = ""; }
        $baseUrl = 'https://superflixapi.quest';
        $u = $baseUrl . '/' . $t . '/' . $i . '/' . $s . '/' . $e;
        $u = preg_replace('/([^:])(\/{2,})/', '$1/', $u);
        echo '<iframe src="' . $u . '" width="100%" height="100%" frameborder="0" allow="autoplay *; encrypted-media *; picture-in-picture *; fullscreen *; clipboard-write *; accelerometer *; gyroscope *; web-share *" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
    }
    RenderPlayer($type, $id, $season, $episode);
?>
</div>
Personalização
Adicione hashes (#) ao final da URL do player para modificar o comportamento ou visual.

#noEpList
Oculta a lista de episódios.

#color:hex
Cor customizada (sem #). Ex: color:ff0000

#noLink
Remove botão de link externo.

#transparent
Fundo transparente para sobreposição.

Plugin Dooplay
Integração nativa para WordPress com tema Dooplay. Suporta Autoembed e Ajax Mode.

v1.4 Estável
Baixar Plugin
SuperFlixAPI
Início
Documentação
Telegram
DMCA
© 2026 SuperFlixAPI. Todos os direitos reservados.
