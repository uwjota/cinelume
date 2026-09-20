export interface LiveChannel {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  preview?: string;
  category?: string;
  embedUrl?: string;
  nowPlaying?: string;
  progress?: number;
  nextProgrammes?: LiveProgramme[];
}

export interface LiveProgramme {
  title: string;
  start?: string;
  end?: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  sport?: string;
  competition?: string;
  status: "upcoming" | "live" | "finished";
  startTime?: string;
  poster?: string;
  description?: string;
  homeTeam?: EventTeam;
  awayTeam?: EventTeam;
  streams: EventStream[];
}

export interface EventTeam {
  name: string;
  logo?: string;
}

export interface EventStream {
  id: string;
  name: string;
  quality?: string;
  url: string;
}
