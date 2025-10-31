

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  POSTPONED = 'POSTPONED',
  WALKOVER = 'WALKOVER',
}

export enum MatchEventType {
  GOAL = 'GOAL',
  ASSIST = 'ASSIST',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  PENALTY_SCORED = 'PENALTY_SCORED',
  PENALTY_MISSED = 'PENALTY_MISSED',
  VAR = 'VAR',
  HALF_TIME = 'HALF_TIME',
  FULL_TIME = 'FULL_TIME',
  SUBSTITUTION = 'SUBSTITUTION',
}

export enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Should be hashed in a real app
  role: UserRole;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Season {
  id: string;
  name: string; // e.g., "2025/26"
}

export interface Competition {
  id: string;
  name: string;
  slug: string;
  season: Season;
  country: Country;
}

export interface Group {
  id: string;
  name: string;
}

export interface Round {
  id: string;
  name: string;
  order: number;
}

export interface TeamSeasonStats {
  pj: number;
  gt: number;
  gx2: number;
  penPercent: number;
  penT: number;
  psoT: number;
  psoPercent: number;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  manager?: string;
  logoUrl: string;
  stats: TeamSeasonStats;
  keyPeople?: string;
  cardImageUrl?: string;
  cardGradient?: string;
  colors?: string[];
}

export interface Player {
  id: string;
  number: number;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  heightCm?: number;
  nationality: string;
  position: 'Atacante' | 'Ponta-D' | 'Ponta-E' | 'Meia-Ofensivo' | 'Meio-Camista' | 'Lateral-D' | 'Lateral-E' | 'Volante' | 'Zagueiro' | 'Goleiro' | 'Treinador';
  teamId: string;
  photoUrl?: string;
  ratings: PlayerRatings;
  stats: PlayerSeasonStats;
}

export interface PlayerRatings {
  fisico: number;
  duelos: number;
  chuteAoGol: number;
  defesa: number;
  passe: number;
  habilidade: number;
  average: number;
}

export interface PlayerSeasonStats {
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  mvpMatches: number;
  mvpRounds?: number;
  golsDuplos: number;
  tackles: number;
  saves: number;
  dribbles?: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  teamId: string;
  playerName?: string;
  description?: string;
}

export interface MatchStatsData {
  posseDeBola: { home: number; away: number };
  precisaoChutes: { home: number; away: number };
  precisaoPasse: { home: number; away: number };
  finalizacoesGol: { home: number; away: number }; // chutes a gol
  passes: { home: number; away: number };
  defesas: { home: number; away: number };
  intercepcoes: { home: number; away: number };
  impedimentos: { home: number; away: number };
  faltas: { home: number; away: number };
  cartoesAmarelos: { home: number; away: number };
  cartoesVermelhos: { home: number; away: number };
  golsShootout: { home: number; away: number };
  golDePenalti: { home: number; away: number };
  golsDuplos: { home: number; away: number };
  xGols: { home: number; away: number };
  totalChutes: { home: number; away: number };
  chutesNaTrave: { home: number; away: number };
  escanteios: { home: number; away: number };
}

export interface Match {
  id: string;
  competitionId: string;
  roundId: string;
  groupId: string;
  date: string;
  time: string;
  venue: string;
  homeTeamId: string;
  awayTeamId: string;
  status: MatchStatus;
  scoreHome: number;
  scoreAway: number;
  penaltiesHome?: number;
  penaltiesAway?: number;
  events: MatchEvent[];
  stats?: MatchStatsData;
  mvpPlayerId?: string;
  roundNumber?: number;
  dateLabel?: string;
  groupLetter?: string;
  highlightsUrl?: string;
  lineups?: {
    homeCoach: string;
    homePlayers: string[];
    awayCoach: string;
    awayPlayers: string[];
  };
}

export interface Standing {
  teamId: string;
  position: number;
  pts: number;
  pj: number;
  v: number;
  vp: number; // vitória por pênaltis
  dp: number; // derrota por pênaltis
  d: number;
  gp: number;
  gc: number;
  sg: number;
}

export interface LeagueData {
  countries: Country[];
  seasons: Season[];
  competitions: Competition[];
  groups: Group[];
  rounds: Round[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  standings: Standing[];
  standingsGroupA: Standing[];
  standingsGroupB: Standing[];
  users: User[];
}