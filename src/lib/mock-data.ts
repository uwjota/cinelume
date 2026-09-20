import type { Media, WatchProgress } from "@/types";

export const heroItems: Media[] = [
  {
    id: "hero-1",
    tmdbId: 912649,
    title: "Venom: The Last Dance",
    overview:
      "Eddie e Venom estão em fuga. Perseguidos por ambos os mundos, a dupla é forçada a tomar uma decisão devastadora que vai encerrar o último ato desta saga.",
    poster: "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
    year: 2024,
    rating: 6.4,
    genres: ["Ação", "Ficção Científica", "Aventura"],
    type: "movie",
  },
  {
    id: "hero-2",
    tmdbId: 1184918,
    title: "O Robô Selvagem",
    overview:
      "Após naufragar em uma ilha desabitada, a robô ROZZUM 7134 — 'Roz' — precisa aprender a se adaptar ao ambiente hostil, aos poucos construindo relações com os animais da ilha e se tornando mãe adotiva de um filhote de ganso órfão.",
    poster: "https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/4zlOPT9CrtIzs0f9bAj7H9mvKgK.jpg",
    year: 2024,
    rating: 8.4,
    genres: ["Animação", "Ficção Científica", "Família"],
    type: "movie",
  },
  {
    id: "hero-3",
    tmdbId: 94997,
    title: "House of the Dragon",
    overview:
      "A história interna da Casa Targaryen, ambientada 200 anos antes dos eventos de Game of Thrones. Acompanhe a guerra civil que dividiu a família e o reino.",
    poster: "https://image.tmdb.org/t/p/w500/t9XkeE7HzOsdQcDDDapDYh8Rrmt.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg",
    year: 2022,
    rating: 8.4,
    genres: ["Drama", "Fantasia", "Ação"],
    type: "series",
  },
];

export const trendingMovies: Media[] = [
  {
    id: "movie-1",
    tmdbId: 1034541,
    title: "Terrifier 3",
    poster: "https://image.tmdb.org/t/p/w500/63xYQj1BwRFielxsBDXvHIJyXVm.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/18TSJF1WLA2871HW0JA0VnqnCUi.jpg",
    year: 2024,
    rating: 6.9,
    genres: ["Terror", "Suspense"],
    type: "movie",
  },
  {
    id: "movie-2",
    tmdbId: 933260,
    title: "O Substantivo",
    poster: "https://image.tmdb.org/t/p/w500/lqoMzCcZYEFK729d6qzt349fB4o.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/xlkclSE4aq7r3JsFIBKtp1KNuRu.jpg",
    year: 2024,
    rating: 7.6,
    genres: ["Terror", "Mistério"],
    type: "movie",
  },
  {
    id: "movie-3",
    tmdbId: 558449,
    title: "Gladiador II",
    poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg",
    year: 2024,
    rating: 6.7,
    genres: ["Ação", "Aventura", "Drama"],
    type: "movie",
  },
  {
    id: "movie-4",
    tmdbId: 1100782,
    title: "Moana 2",
    poster: "https://image.tmdb.org/t/p/w500/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/tElnmtQ6yz1PjN1keLkvoatJLkp.jpg",
    year: 2024,
    rating: 7.0,
    genres: ["Animação", "Aventura", "Família"],
    type: "movie",
  },
  {
    id: "movie-5",
    tmdbId: 974453,
    title: "Absolution",
    poster: "https://image.tmdb.org/t/p/w500/cNtAslrDhk1i3IOZ16vF7df6HCG.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/sPE0Gk1I7VsWzOQwWn8FWrBtey7.jpg",
    year: 2024,
    rating: 5.8,
    genres: ["Ação", "Crime", "Suspense"],
    type: "movie",
  },
  {
    id: "movie-6",
    tmdbId: 698687,
    title: "Transformers One",
    poster: "https://image.tmdb.org/t/p/w500/iRCgqpdVMVXCfNEEhO3kBOHP8xJ.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/b3mdJBbOBIflpi8CXSLnvIKix7X.jpg",
    year: 2024,
    rating: 8.0,
    genres: ["Animação", "Ação", "Ficção Científica"],
    type: "movie",
  },
  {
    id: "movie-7",
    tmdbId: 845781,
    title: "Red One",
    poster: "https://image.tmdb.org/t/p/w500/cdqLnri3NEGcmfnqwk2TSIYrJ1S.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/rOmUuQEZfPXglwFs5ELLLUDKodL.jpg",
    year: 2024,
    rating: 6.5,
    genres: ["Ação", "Comédia", "Fantasia"],
    type: "movie",
  },
  {
    id: "movie-8",
    tmdbId: 1005331,
    title: "Carry-On",
    poster: "https://image.tmdb.org/t/p/w500/sjMN7DRi4sGiledsmllEw5HJjPy.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/rhc8Mtuo3Kh8CndImuGBJQ5Mh1Y.jpg",
    year: 2024,
    rating: 7.0,
    genres: ["Ação", "Suspense"],
    type: "movie",
  },
];

export const popularSeries: Media[] = [
  {
    id: "series-1",
    tmdbId: 1399,
    title: "Game of Thrones",
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/zZqpAXxVSBtxV9qPBcscfXBcJw2.jpg",
    year: 2011,
    rating: 8.4,
    genres: ["Drama", "Fantasia", "Ação"],
    type: "series",
  },
  {
    id: "series-2",
    tmdbId: 1396,
    title: "Breaking Bad",
    poster: "https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW73GM3cQkRH.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    year: 2008,
    rating: 8.9,
    genres: ["Drama", "Crime", "Suspense"],
    type: "series",
  },
  {
    id: "series-3",
    tmdbId: 76479,
    title: "The Boys",
    poster: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82kl.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/7cqKGQMnNabzOpi7qaIgZvQ7NGV.jpg",
    year: 2019,
    rating: 8.5,
    genres: ["Ação", "Ficção Científica", "Crime"],
    type: "series",
  },
  {
    id: "series-4",
    tmdbId: 84958,
    title: "Loki",
    poster: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg",
    year: 2021,
    rating: 8.2,
    genres: ["Drama", "Ficção Científica", "Fantasia"],
    type: "series",
  },
  {
    id: "series-5",
    tmdbId: 93405,
    title: "Squid Game",
    poster: "https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/qw3J9cNeLioOLoR68WX7z79aCdK.jpg",
    year: 2021,
    rating: 7.8,
    genres: ["Drama", "Ação", "Mistério"],
    type: "series",
  },
  {
    id: "series-6",
    tmdbId: 100088,
    title: "The Last of Us",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    year: 2023,
    rating: 8.6,
    genres: ["Drama", "Ação", "Aventura"],
    type: "series",
  },
  {
    id: "series-7",
    tmdbId: 71912,
    title: "The Witcher",
    poster: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfV0GlqHrcdiJq.jpg",
    year: 2019,
    rating: 8.0,
    genres: ["Drama", "Fantasia", "Ação"],
    type: "series",
  },
  {
    id: "series-8",
    tmdbId: 60574,
    title: "Peaky Blinders",
    poster: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/wiE9doxiLwq3WCGamDIOb2PqBqc.jpg",
    year: 2013,
    rating: 8.6,
    genres: ["Drama", "Crime"],
    type: "series",
  },
];

export const popularAnimes: Media[] = [
  {
    id: "anime-1",
    tmdbId: 85937,
    title: "Demon Slayer",
    poster: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/rqbCjB0MYJj0dMAGRHfov0MiMEh.jpg",
    year: 2019,
    rating: 8.7,
    genres: ["Animação", "Ação", "Fantasia"],
    type: "anime",
  },
  {
    id: "anime-2",
    tmdbId: 37854,
    title: "One Piece",
    poster: "https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAEU0jnMAHgokoN.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg",
    year: 1999,
    rating: 8.7,
    genres: ["Animação", "Ação", "Aventura"],
    type: "anime",
  },
  {
    id: "anime-3",
    tmdbId: 31911,
    title: "Naruto Shippuden",
    poster: "https://image.tmdb.org/t/p/w500/zAYRe2bJxpWTVrwwmBc00VFkAf4.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/hKzmY3HfAyFqfhTkGJHLfoxiVCN.jpg",
    year: 2007,
    rating: 8.6,
    genres: ["Animação", "Ação", "Aventura"],
    type: "anime",
  },
  {
    id: "anime-4",
    tmdbId: 1429,
    title: "Attack on Titan",
    poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/rqbCjB0MYJj0dMAGRHfov0MiMEh.jpg",
    year: 2013,
    rating: 8.7,
    genres: ["Animação", "Ação", "Fantasia"],
    type: "anime",
  },
  {
    id: "anime-5",
    tmdbId: 95557,
    title: "Jujutsu Kaisen",
    poster: "https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccAc.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/gmECX1DvFgdpH1IjOcrDaih9ryW.jpg",
    year: 2020,
    rating: 8.6,
    genres: ["Animação", "Ação", "Fantasia"],
    type: "anime",
  },
  {
    id: "anime-6",
    tmdbId: 62104,
    title: "Dragon Ball Super",
    poster: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/fVzXp3NwovUlLe7fvoRynCmBPNc.jpg",
    year: 2015,
    rating: 7.3,
    genres: ["Animação", "Ação", "Ficção Científica"],
    type: "anime",
  },
];

export const popularDoramas: Media[] = [
  {
    id: "dorama-1",
    tmdbId: 99966,
    title: "All of Us Are Dead",
    poster: "https://image.tmdb.org/t/p/w500/pTEFqAjLd5YTsMD6NSUxV6Dq7A6.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/8Xs20y8gFR0W9u8Yy9NKdpZtSu7.jpg",
    year: 2022,
    rating: 8.2,
    genres: ["Drama", "Ação", "Terror"],
    type: "dorama",
  },
  {
    id: "dorama-2",
    tmdbId: 135157,
    title: "Alchemy of Souls",
    poster: "https://image.tmdb.org/t/p/w500/q2IiPRSXPOZ6qVRj36WRAYEQyGr.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/kXlrGioGfFKLIzFQ3bGFPdCdBkH.jpg",
    year: 2022,
    rating: 8.7,
    genres: ["Drama", "Fantasia", "Romance"],
    type: "dorama",
  },
  {
    id: "dorama-3",
    tmdbId: 126485,
    title: "Moving",
    poster: "https://image.tmdb.org/t/p/w500/bstarPROBSfcW06sLNEJauBqiNr.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/gX7pMFAMoV2J2kw4eMUU6zCrhEn.jpg",
    year: 2023,
    rating: 8.8,
    genres: ["Ação", "Drama", "Ficção Científica"],
    type: "dorama",
  },
  {
    id: "dorama-4",
    tmdbId: 117376,
    title: "Vincenzo",
    poster: "https://image.tmdb.org/t/p/w500/dvXJgEDQXhL93mfeZbzHEQlVYrc.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/mGVlXJ6JTlhRhzVzBnNkxcQqWk0.jpg",
    year: 2021,
    rating: 8.4,
    genres: ["Drama", "Comédia", "Crime"],
    type: "dorama",
  },
  {
    id: "dorama-5",
    tmdbId: 67915,
    title: "Goblin",
    poster: "https://image.tmdb.org/t/p/w500/4dLpGTbcJuw9CXGmNPORJbVS0nz.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/sJAknMvwPBUTVJnQsbTFVDqCLkM.jpg",
    year: 2016,
    rating: 8.6,
    genres: ["Drama", "Romance", "Fantasia"],
    type: "dorama",
  },
  {
    id: "dorama-6",
    tmdbId: 218539,
    title: "My Demon",
    poster: "https://image.tmdb.org/t/p/w500/mOXzc15BXUGRzMuCG58SO8b0vS0.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/9zcbqSxbsNOoqEv6YpOlkFBom5H.jpg",
    year: 2023,
    rating: 8.0,
    genres: ["Comédia", "Romance", "Fantasia"],
    type: "dorama",
  },
];

export const newReleases: Media[] = [
  {
    id: "release-1",
    tmdbId: 1241982,
    title: "Moana 2",
    poster: "https://image.tmdb.org/t/p/w500/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/tElnmtQ6yz1PjN1keLkvoatJLkp.jpg",
    year: 2024,
    rating: 7.0,
    genres: ["Animação", "Aventura", "Família"],
    type: "movie",
  },
  {
    id: "release-2",
    tmdbId: 839033,
    title: "The Wild Robot",
    poster: "https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/4zlOPT9CrtIzs0f9bAj7H9mvKgK.jpg",
    year: 2024,
    rating: 8.4,
    genres: ["Animação", "Ficção Científica"],
    type: "movie",
  },
  {
    id: "release-3",
    tmdbId: 533535,
    title: "Deadpool & Wolverine",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    year: 2024,
    rating: 7.7,
    genres: ["Ação", "Comédia", "Ficção Científica"],
    type: "movie",
  },
  {
    id: "release-4",
    tmdbId: 1022789,
    title: "Inside Out 2",
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MN75UmLBOY3.jpg",
    year: 2024,
    rating: 7.6,
    genres: ["Animação", "Família", "Comédia"],
    type: "movie",
  },
  {
    id: "release-5",
    tmdbId: 957452,
    title: "The Crow",
    poster: "https://image.tmdb.org/t/p/w500/58QT4cPJ2u2TpWA88oNiIHKSIWJ.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/Asg2UUwipAdE87MbRxnXtd8mJQD.jpg",
    year: 2024,
    rating: 5.5,
    genres: ["Ação", "Fantasia", "Terror"],
    type: "movie",
  },
  {
    id: "release-6",
    tmdbId: 1029575,
    title: "The Family Plan",
    poster: "https://image.tmdb.org/t/p/w500/jLLtx3nTRSLGvWXEpnP2DGQOA1h.jpg",
    backdrop:
      "https://image.tmdb.org/t/p/original/sRLC052ieEzkQs9dEtPMfFxYkej.jpg",
    year: 2023,
    rating: 7.0,
    genres: ["Ação", "Comédia"],
    type: "movie",
  },
];

export const continueWatching: WatchProgress[] = [
  {
    mediaId: "series-3",
    mediaType: "series",
    season: 4,
    episode: 5,
    progress: 1847,
    duration: 3600,
    updatedAt: "2024-12-15T22:30:00Z",
    poster: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82kl.jpg",
    title: "The Boys",
    episodeTitle: "Beware the Jabberwock, My Son",
  },
  {
    mediaId: "movie-3",
    mediaType: "movie",
    progress: 4200,
    duration: 8880,
    updatedAt: "2024-12-14T20:15:00Z",
    poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    title: "Gladiador II",
  },
  {
    mediaId: "anime-1",
    mediaType: "anime",
    season: 4,
    episode: 8,
    progress: 900,
    duration: 1440,
    updatedAt: "2024-12-13T18:45:00Z",
    poster: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    title: "Demon Slayer",
    episodeTitle: "The Hashira Training Arc",
  },
  {
    mediaId: "series-6",
    mediaType: "series",
    season: 2,
    episode: 3,
    progress: 2100,
    duration: 3300,
    updatedAt: "2024-12-12T21:00:00Z",
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    title: "The Last of Us",
    episodeTitle: "Left Behind",
  },
];
