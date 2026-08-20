export type Player = 'white' | 'black';

export interface PointState {
  count: number;
  color: Player | null;
}

export interface BoardState {
  points: PointState[]; // indices 0..23 corresponding to points 1..24
  bar: {
    white: number;
    black: number;
  };
  borneOff: {
    white: number;
    black: number;
  };
}

export interface MoveStep {
  from: number | 'bar'; // 0..23 or 'bar'
  to: number | 'off';   // 0..23 or 'off'
  dieUsed: number;
  isHit: boolean;
  player: Player;
}

export interface MoveLogEntry {
  player: Player;
  dice: number[];
  steps: MoveStep[];
  isMistake: boolean;
  betterSteps?: MoveStep[];
}

export interface TurnSequence {
  steps: MoveStep[];
  finalBoard: BoardState;
}

export interface MoveValidation {
  valid: boolean;
  to: number | 'off';
  isHit: boolean;
  reason?: string;
}

export type WinType = 'single' | 'gammon' | 'backgammon';

export interface TurnHistory {
  player: Player;
  diceRolled: [number, number];
  moves: MoveStep[];
  boardBefore: BoardState;
}

export type BearingDirection = 'counterclockwise' | 'clockwise';
export type GameMode = 'ai' | 'local';
export type CubeMode = 'with_cube' | 'no_cube';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'master';
export type StakeType = 'points' | 'money';

export interface GameHistoryEntry {
  gameNumber: number;
  winner: Player;
  winType: WinType;
  pointsWon: number;
  cubeValue: number;
  finalScore: { white: number; black: number };
  totalTurns: number;
  hitsCount: { white: number; black: number };
  keyEvents: string[];
}

export interface MatchHistoryEntry {
  id: string;
  date: number; // unix timestamp
  mode: GameMode;
  cubeMode?: CubeMode;
  aiDifficulty?: AIDifficulty;
  playerColor: Player;
  stakeType: StakeType;
  matchTarget: number;
  stakePerPoint: number;
  winner: Player;
  isUserWinner: boolean;
  finalScore: { white: number; black: number };
  games: GameHistoryEntry[];
  totalGames: number;
  keyEvents: string[];
  durationSeconds: number;
}

export interface CareerStats {
  totalGamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winPercentage: number;
  currentStreak: number;
  longestStreak: number;
  totalMatchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  singleWins: number;
  gammonWins: number;
  backgammonWins: number;
  doublesAccepted: number;
  doublesWon: number;
  byDifficulty: {
    easy: { played: number; won: number; lost: number };
    medium: { played: number; won: number; lost: number };
    hard: { played: number; won: number; lost: number };
  };
}

export type BoardTheme = 'warm_oak' | 'classic_walnut' | 'royal_green' | 'midnight_ebony';
export type CheckerTheme =
  | 'auto'
  | 'ivory_amber'
  | 'classic_ebony'
  | 'cream_ruby'
  | 'platinum_gold'
  | 'pearl_emerald';

export interface GameSettings {
  mode: GameMode;
  cubeMode: CubeMode; // 'with_cube' (Doubling Cube Modu) | 'no_cube' (Standart / Katlama Zarsız)
  boardTheme?: BoardTheme; // Board color theme option
  checkerTheme?: CheckerTheme; // Checker / stone color style option
  aiDifficulty: AIDifficulty;
  playerColor: Player; // for AI mode: which color human controls
  stakeType: StakeType;
  matchTarget: number; // for points match (e.g. 1, 3, 5, 7, 11)
  stakePerPoint: number; // for money match (e.g. $10, $25, $50, $100)
  autoDoubleOnTie: boolean; // Auto-doubles cube on opening roll ties
  bearingDirection: BearingDirection; // Clockwise vs Counterclockwise
  soundEnabled: boolean;
  highlightMoves: boolean;
  showPipCount: boolean; // Toggle pip count visibility on HUD
  autoRoll: boolean;
  crawfordRule: boolean;
  mistakeFlagging: boolean; // Flag clearly suboptimal human turns after they're played
}

export interface DoublingCubeState {
  value: number; // 1, 2, 4, 8, 16, 32, 64
  owner: Player | 'neutral'; // neutral at start, then held by player who accepted double
  isOffered: boolean;
  offeredBy: Player | null;
  autoDoublesCount: number; // count of opening tie auto-doubles
}

export type GamePhase =
  | 'start_menu'
  | 'opening_roll'
  | 'rolling'
  | 'doubling_offered'
  | 'moving'
  | 'ai_thinking'
  | 'game_over'
  | 'match_over';

export interface ScoreState {
  white: number;
  black: number;
  whiteEarnings: number; // For money mode ($)
  blackEarnings: number;
  gamesPlayed: number;
  isCrawford: boolean;
}

export interface PipCount {
  white: number;
  black: number;
}
