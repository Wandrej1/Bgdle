import { GameStats, GuessEvaluation } from '../types/game';

const STATS_KEY = 'brettspieldle_stats';
const DAILY_STATE_PREFIX = 'brettspieldle_daily_';

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 }
};

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      guessDistribution: {
        ...DEFAULT_STATS.guessDistribution,
        ...(parsed.guessDistribution || {})
      }
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
}

export function recordGameResult(won: boolean, guessCount: number, dateStr?: string): GameStats {
  const current = loadGameStats();
  
  // Prevent duplicate count for same daily game date
  if (dateStr && current.lastPlayedDate === dateStr) {
    return current;
  }

  const updated: GameStats = {
    gamesPlayed: current.gamesPlayed + 1,
    gamesWon: won ? current.gamesWon + 1 : current.gamesWon,
    currentStreak: won ? current.currentStreak + 1 : 0,
    maxStreak: won ? Math.max(current.maxStreak, current.currentStreak + 1) : current.maxStreak,
    guessDistribution: { ...current.guessDistribution },
    lastPlayedDate: dateStr
  };

  if (won) {
    const bucket = Math.min(Math.max(guessCount, 1), 10);
    updated.guessDistribution[bucket] = (updated.guessDistribution[bucket] || 0) + 1;
  }

  saveGameStats(updated);
  return updated;
}

export interface SavedDailyState {
  date: string;
  guessIds: string[];
  isCompleted: boolean;
  hasWon: boolean;
}

export function loadDailyState(dateStr: string): SavedDailyState | null {
  try {
    const raw = localStorage.getItem(DAILY_STATE_PREFIX + dateStr);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDailyState(state: SavedDailyState): void {
  try {
    localStorage.setItem(DAILY_STATE_PREFIX + state.date, JSON.stringify(state));
  } catch {
    // Ignore errors
  }
}
