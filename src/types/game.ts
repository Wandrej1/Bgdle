export type MatchStatus = 'EXACT' | 'PARTIAL' | 'WRONG';
export type Direction = 'UP' | 'DOWN' | 'NONE';

export interface BoardGame {
  id: string;
  title: string;
  originalTitle?: string;
  minPlayers: number;
  maxPlayers: number;
  minPlaytime: number;
  maxPlaytime: number;
  genre: string;
  designer: string;
  mechanic1: string;
  mechanic2: string;
  releaseYear: number;
  description: string;
  awards?: string;
  clueMaterial?: string;
  publisher?: string;
  difficulty?: 'Einfach' | 'Mittel' | 'Gehoben' | 'Experte';
  themeColor?: string;
  bggRank: number;
}

export interface CategoryResult {
  value: string;
  status: MatchStatus;
  direction?: Direction;
  subtext?: string;
}

export interface GuessEvaluation {
  game: BoardGame;
  titleMatch: boolean;
  players: CategoryResult;
  playtime: CategoryResult;
  genre: CategoryResult;
  designer: CategoryResult;
  mechanic1: CategoryResult;
  mechanic2: CategoryResult;
  releaseYear: CategoryResult;
  bggRank: CategoryResult;
  overallSuccess: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
  lastPlayedDate?: string;
}

export type GameMode = 'DAILY' | 'PRACTICE';
