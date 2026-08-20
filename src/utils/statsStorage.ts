import {
  CareerStats,
  MatchHistoryEntry,
  Player,
  WinType,
  AIDifficulty,
} from '../types/backgammon';

const STATS_STORAGE_KEY = 'grandmaster_bg_career_stats_v1';
const HISTORY_STORAGE_KEY = 'grandmaster_bg_match_history_v1';

export const INITIAL_CAREER_STATS: CareerStats = {
  totalGamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  winPercentage: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalMatchesPlayed: 0,
  matchesWon: 0,
  matchesLost: 0,
  singleWins: 0,
  gammonWins: 0,
  backgammonWins: 0,
  doublesAccepted: 0,
  doublesWon: 0,
  byDifficulty: {
    easy: { played: 0, won: 0, lost: 0 },
    medium: { played: 0, won: 0, lost: 0 },
    hard: { played: 0, won: 0, lost: 0 },
  },
};

export function loadCareerStats(): CareerStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return { ...INITIAL_CAREER_STATS };
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CAREER_STATS,
      ...parsed,
      byDifficulty: {
        easy: { ...INITIAL_CAREER_STATS.byDifficulty.easy, ...(parsed.byDifficulty?.easy || {}) },
        medium: { ...INITIAL_CAREER_STATS.byDifficulty.medium, ...(parsed.byDifficulty?.medium || {}) },
        hard: { ...INITIAL_CAREER_STATS.byDifficulty.hard, ...(parsed.byDifficulty?.hard || {}) },
      },
    };
  } catch {
    return { ...INITIAL_CAREER_STATS };
  }
}

export function saveCareerStats(stats: CareerStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats to localStorage', err);
  }
}

export function loadMatchHistory(): MatchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMatchHistory(history: MatchHistoryEntry[]): void {
  try {
    // Keep up to latest 50 completed matches
    const trimmed = history.slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.error('Failed to save match history to localStorage', err);
  }
}

export function recordCompletedGame(
  winner: Player,
  userPlayer: Player,
  winType: WinType,
  cubeValue: number,
  mode: string,
  difficulty?: AIDifficulty
): CareerStats {
  const current = loadCareerStats();
  const isUserWin = mode === 'ai' ? winner === userPlayer : winner === 'white';

  const totalGames = current.totalGamesPlayed + 1;
  const gamesWon = current.gamesWon + (isUserWin ? 1 : 0);
  const gamesLost = current.gamesLost + (isUserWin ? 0 : 1);
  const winPercentage = Math.round((gamesWon / totalGames) * 1000) / 10;

  const currentStreak = isUserWin ? current.currentStreak + 1 : 0;
  const longestStreak = Math.max(current.longestStreak, currentStreak);

  let singleWins = current.singleWins;
  let gammonWins = current.gammonWins;
  let backgammonWins = current.backgammonWins;

  if (isUserWin) {
    if (winType === 'backgammon') backgammonWins++;
    else if (winType === 'gammon') gammonWins++;
    else singleWins++;
  }

  const doublesWon = isUserWin && cubeValue > 1 ? current.doublesWon + 1 : current.doublesWon;

  // By difficulty
  const byDiff = { ...current.byDifficulty };
  if (mode === 'ai') {
    const diffKey: 'easy' | 'medium' | 'hard' =
      difficulty === 'hard' || difficulty === 'master'
        ? 'hard'
        : difficulty === 'medium'
        ? 'medium'
        : 'easy';

    byDiff[diffKey] = {
      played: byDiff[diffKey].played + 1,
      won: byDiff[diffKey].won + (isUserWin ? 1 : 0),
      lost: byDiff[diffKey].lost + (isUserWin ? 0 : 1),
    };
  }

  const updatedStats: CareerStats = {
    ...current,
    totalGamesPlayed: totalGames,
    gamesWon,
    gamesLost,
    winPercentage,
    currentStreak,
    longestStreak,
    singleWins,
    gammonWins,
    backgammonWins,
    doublesWon,
    byDifficulty: byDiff,
  };

  saveCareerStats(updatedStats);
  return updatedStats;
}

export function recordMatchEntry(entry: MatchHistoryEntry): {
  stats: CareerStats;
  history: MatchHistoryEntry[];
} {
  const currentStats = loadCareerStats();
  const currentHistory = loadMatchHistory();

  const isUserWin = entry.isUserWinner;
  const totalMatches = currentStats.totalMatchesPlayed + 1;
  const matchesWon = currentStats.matchesWon + (isUserWin ? 1 : 0);
  const matchesLost = currentStats.matchesLost + (isUserWin ? 0 : 1);

  const updatedStats: CareerStats = {
    ...currentStats,
    totalMatchesPlayed: totalMatches,
    matchesWon,
    matchesLost,
  };

  const updatedHistory = [entry, ...currentHistory];

  saveCareerStats(updatedStats);
  saveMatchHistory(updatedHistory);

  return { stats: updatedStats, history: updatedHistory };
}

export function clearAllStatsAndHistory(): { stats: CareerStats; history: MatchHistoryEntry[] } {
  saveCareerStats(INITIAL_CAREER_STATS);
  saveMatchHistory([]);
  return { stats: INITIAL_CAREER_STATS, history: [] };
}
