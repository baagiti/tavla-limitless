import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CareerStats,
  MatchHistoryEntry,
  AIDifficulty,
} from '../types/backgammon';
import {
  X,
  Trophy,
  History,
  Flame,
  TrendingUp,
  Award,
  Bot,
  Users,
  ChevronDown,
  ChevronUp,
  Trash2,
  Calendar,
  Zap,
} from 'lucide-react';

interface StatsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CareerStats;
  history: MatchHistoryEntry[];
  onClearData: () => void;
}

export const StatsHistoryModal: React.FC<StatsHistoryModalProps> = ({
  isOpen,
  onClose,
  stats,
  history,
  onClearData,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'history'>('stats');
  const [filterMode, setFilterMode] = useState<'all' | 'ai' | 'local'>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (filterMode === 'ai') return item.mode === 'ai';
    if (filterMode === 'local') return item.mode === 'local';
    return true;
  });

  const getDifficultyBadge = (diff?: AIDifficulty) => {
    switch (diff) {
      case 'easy':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            Easy AI
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            Medium AI
          </span>
        );
      case 'hard':
      case 'master':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-800/60">
            Hard AI
          </span>
        );
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div
      id="stats-history-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl max-h-[90vh] bg-[#140e0a] border border-[#2d1e15] rounded-sm shadow-2xl flex flex-col text-[#e0d5c1] relative overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2d1e15] flex items-center justify-between bg-[#1a130f]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#2d1e15] text-[#c2a278] border border-[#4a3528]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif tracking-tight text-[#f9f3e5]">
                Game Statistics & History
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c2a278]/70">
                Career Performance & Match Archive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#e0d5c1]/50 hover:text-[#e0d5c1] hover:bg-[#2d1e15] rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#2d1e15] bg-[#140e0a] px-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('stats');
              setConfirmClear(false);
            }}
            className={`flex items-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'stats'
                ? 'border-[#c2a278] text-[#c2a278] bg-[#1a130f]/60'
                : 'border-transparent text-[#e0d5c1]/50 hover:text-[#e0d5c1]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Career Overview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              setConfirmClear(false);
            }}
            className={`flex items-center gap-2 py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#c2a278] text-[#c2a278] bg-[#1a130f]/60'
                : 'border-transparent text-[#e0d5c1]/50 hover:text-[#e0d5c1]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Match Log ({history.length})</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Top Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Total Games */}
                <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/50">
                    Games Played
                  </span>
                  <div className="text-2xl font-serif text-[#f9f3e5] mt-1">
                    {stats.totalGamesPlayed}
                  </div>
                  <span className="text-[10px] text-[#c2a278]/80 mt-1">
                    {stats.totalMatchesPlayed} matches
                  </span>
                </div>

                {/* Win / Loss */}
                <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/50">
                    Won / Lost
                  </span>
                  <div className="text-2xl font-serif text-[#f9f3e5] mt-1 flex items-baseline gap-1.5">
                    <span className="text-emerald-400">{stats.gamesWon}</span>
                    <span className="text-xs text-[#e0d5c1]/30">/</span>
                    <span className="text-rose-400">{stats.gamesLost}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 mt-1">
                    {stats.matchesWon} match wins
                  </span>
                </div>

                {/* Win Percentage */}
                <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm flex flex-col justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/50">
                    Win Rate
                  </span>
                  <div className="text-2xl font-serif text-[#c2a278] mt-1">
                    {stats.totalGamesPlayed > 0 ? `${stats.winPercentage}%` : '0%'}
                  </div>
                  <div className="w-full bg-[#2d1e15] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#c2a278] h-full transition-all"
                      style={{ width: `${Math.min(100, stats.winPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Streaks */}
                <div className="p-3.5 bg-[#1a130f] border border-[#2d1e15] rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/50">
                      Streak
                    </span>
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-2xl font-serif text-[#f9f3e5] mt-1">
                    {stats.currentStreak}
                    <span className="text-xs font-mono text-[#e0d5c1]/40 ml-1">current</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 mt-1">
                    Best: {stats.longestStreak} wins
                  </span>
                </div>
              </div>

              {/* AI Difficulty Performance */}
              <div className="p-4 bg-[#1a130f] border border-[#2d1e15] rounded-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#2d1e15]">
                  <Bot className="w-4 h-4 text-[#c2a278]" />
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#f9f3e5]">
                    Performance vs AI Difficulties
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Easy AI */}
                  <div className="p-3 bg-[#140e0a] border border-[#2d1e15] rounded-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-emerald-300">Easy</span>
                      <span className="text-[10px] font-mono text-[#e0d5c1]/50">
                        {stats.byDifficulty.easy.played} games
                      </span>
                    </div>
                    <div className="text-sm font-mono flex items-center justify-between text-[#e0d5c1]/80">
                      <span>W: {stats.byDifficulty.easy.won}</span>
                      <span>L: {stats.byDifficulty.easy.lost}</span>
                      <span className="text-emerald-400 font-bold">
                        {stats.byDifficulty.easy.played > 0
                          ? `${Math.round(
                              (stats.byDifficulty.easy.won / stats.byDifficulty.easy.played) * 100
                            )}%`
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Medium AI */}
                  <div className="p-3 bg-[#140e0a] border border-[#2d1e15] rounded-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-amber-300">Medium</span>
                      <span className="text-[10px] font-mono text-[#e0d5c1]/50">
                        {stats.byDifficulty.medium.played} games
                      </span>
                    </div>
                    <div className="text-sm font-mono flex items-center justify-between text-[#e0d5c1]/80">
                      <span>W: {stats.byDifficulty.medium.won}</span>
                      <span>L: {stats.byDifficulty.medium.lost}</span>
                      <span className="text-amber-400 font-bold">
                        {stats.byDifficulty.medium.played > 0
                          ? `${Math.round(
                              (stats.byDifficulty.medium.won / stats.byDifficulty.medium.played) *
                                100
                            )}%`
                          : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Hard AI */}
                  <div className="p-3 bg-[#140e0a] border border-[#2d1e15] rounded-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-rose-300">Hard (Tactical)</span>
                      <span className="text-[10px] font-mono text-[#e0d5c1]/50">
                        {stats.byDifficulty.hard.played} games
                      </span>
                    </div>
                    <div className="text-sm font-mono flex items-center justify-between text-[#e0d5c1]/80">
                      <span>W: {stats.byDifficulty.hard.won}</span>
                      <span>L: {stats.byDifficulty.hard.lost}</span>
                      <span className="text-rose-400 font-bold">
                        {stats.byDifficulty.hard.played > 0
                          ? `${Math.round(
                              (stats.byDifficulty.hard.won / stats.byDifficulty.hard.played) * 100
                            )}%`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Victory Quality Breakdown */}
              <div className="p-4 bg-[#1a130f] border border-[#2d1e15] rounded-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#2d1e15]">
                  <Award className="w-4 h-4 text-[#c2a278]" />
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#f9f3e5]">
                    Victory Type Breakdown
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                  <div className="p-2.5 bg-[#140e0a] border border-[#2d1e15] rounded-sm">
                    <div className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/50">
                      Single (1x)
                    </div>
                    <div className="text-lg font-serif text-[#f9f3e5] mt-0.5">
                      {stats.singleWins}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#140e0a] border border-[#2d1e15] rounded-sm">
                    <div className="text-[10px] uppercase tracking-wider text-amber-400/70">
                      Gammon (2x)
                    </div>
                    <div className="text-lg font-serif text-amber-400 mt-0.5">
                      {stats.gammonWins}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#140e0a] border border-[#2d1e15] rounded-sm">
                    <div className="text-[10px] uppercase tracking-wider text-[#c2a278]">
                      Backgammon (3x)
                    </div>
                    <div className="text-lg font-serif text-[#c2a278] mt-0.5">
                      {stats.backgammonWins}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {(['all', 'ai', 'local'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFilterMode(mode)}
                      className={`px-3 py-1 rounded-sm text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                        filterMode === mode
                          ? 'border border-[#c2a278] bg-[#2d1e15] text-[#c2a278]'
                          : 'border border-[#2d1e15] bg-[#1a130f] text-[#e0d5c1]/50 hover:text-[#e0d5c1]'
                      }`}
                    >
                      {mode === 'all' ? 'All Matches' : mode === 'ai' ? 'vs AI' : 'Pass & Play'}
                    </button>
                  ))}
                </div>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-[11px] text-rose-400/70 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Archive</span>
                  </button>
                )}
              </div>

              {/* Confirm Clear Alert */}
              {confirmClear && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-sm flex items-center justify-between text-xs">
                  <span className="text-rose-200">
                    Are you sure you want to reset all stats and history?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onClearData();
                        setConfirmClear(false);
                      }}
                      className="px-2.5 py-1 bg-rose-700 text-white rounded-sm text-[11px] font-semibold uppercase tracking-wider hover:bg-rose-600 cursor-pointer"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-2.5 py-1 bg-[#2d1e15] text-[#e0d5c1] rounded-sm text-[11px] hover:bg-[#4a3528] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* History Match Items */}
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#2d1e15] rounded-sm bg-[#1a130f]/40">
                  <History className="w-8 h-8 mx-auto text-[#c2a278]/30 mb-2" />
                  <p className="text-sm text-[#e0d5c1]/60">No completed matches recorded yet.</p>
                  <p className="text-[11px] text-[#e0d5c1]/40 mt-1">
                    Play a match against the AI or a friend to record career history.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredHistory.map((match) => {
                    const isExpanded = expandedMatchId === match.id;

                    return (
                      <div
                        key={match.id}
                        className="bg-[#1a130f] border border-[#2d1e15] rounded-sm overflow-hidden hover:border-[#4a3528] transition-colors"
                      >
                        {/* Match Summary Bar */}
                        <div
                          onClick={() =>
                            setExpandedMatchId(isExpanded ? null : match.id)
                          }
                          className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            {/* Outcome Badge */}
                            <span
                              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                                match.isUserWinner
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                                  : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                              }`}
                            >
                              {match.isUserWinner ? 'Victory' : 'Defeat'}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-[#f9f3e5]">
                                  {match.mode === 'ai' ? 'Match vs AI' : 'Pass & Play Match'}
                                </span>
                                {match.mode === 'ai' && getDifficultyBadge(match.aiDifficulty)}
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-[#2d1e15] text-[#c2a278]/80 border border-[#4a3528]">
                                  {match.cubeMode === 'no_cube' ? 'Classic' : 'Cube 64'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-[#e0d5c1]/40 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(match.date)}</span>
                                <span>•</span>
                                <span>{match.totalGames} {match.totalGames === 1 ? 'game' : 'games'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Score & Expand */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-mono font-bold text-[#c2a278]">
                                {match.finalScore.white} — {match.finalScore.black}
                              </div>
                              <div className="text-[10px] font-mono text-[#e0d5c1]/50">
                                {match.stakeType === 'points'
                                  ? `Target: ${match.matchTarget} PTS`
                                  : `$${match.stakePerPoint}/pt`}
                              </div>
                            </div>

                            <button className="text-[#e0d5c1]/40 hover:text-[#e0d5c1]">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Key Events & Game Breakdown */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-1 border-t border-[#2d1e15] bg-[#140e0a]/80 space-y-3"
                            >
                              {/* Key Events Highlights */}
                              {match.keyEvents && match.keyEvents.length > 0 && (
                                <div>
                                  <span className="text-[10px] uppercase tracking-wider text-[#c2a278] block mb-1.5 font-semibold flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-[#c2a278]" /> Key Match Events
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {match.keyEvents.map((evt, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-[#2d1e15] border border-[#4a3528] rounded text-[10px] text-[#e0d5c1]/80"
                                      >
                                        {evt}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Games Breakdown */}
                              {match.games && match.games.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase tracking-wider text-[#e0d5c1]/40 block">
                                    Individual Games Summary
                                  </span>
                                  <div className="space-y-1">
                                    {match.games.map((g, gIdx) => (
                                      <div
                                        key={gIdx}
                                        className="flex items-center justify-between text-[11px] p-2 bg-[#1a130f] border border-[#2d1e15] rounded-sm"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-[#c2a278]">
                                            Game {g.gameNumber}
                                          </span>
                                          <span className="capitalize text-[#e0d5c1]">
                                            {g.winner} Won ({g.winType})
                                          </span>
                                          {g.cubeValue > 1 && (
                                            <span className="px-1.5 py-0.2 bg-[#2d1e15] text-[#c2a278] rounded text-[9px] font-mono">
                                              {g.cubeValue}x Cube
                                            </span>
                                          )}
                                        </div>

                                        <div className="font-mono text-[#e0d5c1]/70">
                                          +{g.pointsWon * g.cubeValue} PTS
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#2d1e15] bg-[#1a130f] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm border border-[#c2a278] bg-[#c2a278] text-[#140e0a] text-xs uppercase tracking-[0.15em] font-semibold hover:bg-[#d6b78d] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
